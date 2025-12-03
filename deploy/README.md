# Deploy do Mailsender Frontend no Kubernetes

Este guia explica como fazer o deploy do frontend do Mailsender no Kubernetes.

## Pré-requisitos

- Acesso ao cluster Kubernetes configurado
- kubectl instalado e configurado
- Docker instalado para build das imagens
- Conta no Docker Hub (ruanlopes1350)
- Backend já deployado e funcionando

## Estrutura dos Arquivos

- `frontend-configmap.example.yaml` - Template de configuração (copiar e editar)
- `deploy-frontend.yaml` - Deploy do frontend Next.js

## Passo a Passo

### 1. Preparar ConfigMap

```bash
# Copiar o template
cp frontend-configmap.example.yaml frontend-configmap.yaml

# Editar e substituir os placeholders:
# - <YOUR_API_DOMAIN> - URL pública da API (ex: https://api-mailsender.instituicao.edu.br)
# - <YOUR_FRONTEND_DOMAIN> - URL pública do frontend (ex: https://mailsender.instituicao.edu.br)
# - <REPLACE_WITH_SECURE_VALUE> - Secret do NextAuth
```

**Gerar secret do NextAuth:**
```bash
openssl rand -base64 48
```

### 2. Build e Push da Imagem Docker

```bash
# Build da imagem
docker build -t ruanlopes1350/mailsender-frontend:latest \
  --build-arg NEXT_PUBLIC_API_URI=https://<YOUR_API_DOMAIN>/api \
  -f Dockerfile .

# Login no Docker Hub (se necessário)
docker login

# Push da imagem
docker push ruanlopes1350/mailsender-frontend:latest
```

**Importante**: Substitua `<YOUR_API_DOMAIN>` pela URL real da sua API durante o build.

### 3. Deploy no Kubernetes

```bash
# Aplicar ConfigMap (com suas configurações)
kubectl apply -f frontend-configmap.yaml

# Deploy do frontend
kubectl apply -f deploy-frontend.yaml
```

### 4. Verificar o Deploy

```bash
# Ver todos os recursos
kubectl get all -l app=mailsender-frontend

# Ou ver pod específico
kubectl get pods -l app=mailsender-frontend

# Ver logs
kubectl logs -f deployment/mailsender-frontend

# Verificar se o pod está rodando
kubectl get pods -l app=mailsender-frontend

# Descrever o pod (para troubleshooting)
kubectl describe pod -l app=mailsender-frontend
```

### 5. Acessar o Serviço

O serviço é exposto internamente no cluster como `mailsender` na porta 80.

Para acesso externo, configure um Ingress ou use port-forward para testes:

```bash
# Port forward para teste local
kubectl port-forward service/mailsender 3000:80

# Acessar no navegador
# http://localhost:3000
```

## Configurar Ingress (Acesso Externo)

O nome do serviço no cluster é `mailsender`. Configure seu Ingress de acordo com as regras da instituição.

Exemplo de configuração Ingress (adapte conforme necessário):

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: mailsender-ingress
  annotations:
    # Adicione annotations necessárias para seu cluster
spec:
  rules:
  - host: mailsender.instituicao.edu.br
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: mailsender
            port:
              number: 80
  # Configure TLS se necessário
  tls:
  - hosts:
    - mailsender.instituicao.edu.br
    secretName: mailsender-tls
```

## Atualizar Deploy

### Atualização do Código

Quando fizer alterações no código:

```bash
# 1. Build nova imagem
cd /home/ruanlopes/Documents/mailsender/frontend
docker build -t ruanlopes1350/mailsender-frontend:latest \
  --build-arg NEXT_PUBLIC_API_URI=https://mailsender-backend.app.fslab.dev/api \
  -f Dockerfile .

# 2. Push para Docker Hub
docker push ruanlopes1350/mailsender-frontend:latest

# 3. Forçar atualização no Kubernetes (rollout)
kubectl rollout restart deployment/mailsender-frontend

# 4. Acompanhar o rollout
kubectl rollout status deployment/mailsender-frontend
```

### Atualização do ConfigMap

Quando alterar configurações no ConfigMap:

```bash
# 1. Editar o arquivo
vim frontend-configmap.yaml

# 2. Aplicar as mudanças
kubectl apply -f frontend-configmap.yaml

# 3. Reiniciar o deployment para carregar as novas configurações
kubectl rollout restart deployment/mailsender-frontend

# 4. Verificar se aplicou corretamente
kubectl rollout status deployment/mailsender-frontend
```

### Atualização Rápida (Somente Rollout)

Se a imagem no Docker Hub já foi atualizada e você só quer forçar o pull:

```bash
kubectl rollout restart deployment/mailsender-frontend
kubectl rollout status deployment/mailsender-frontend
```

## Troubleshooting

### Pod não inicia

```bash
# Ver eventos do pod
kubectl describe pod -l app=mailsender-frontend

# Ver logs
kubectl logs -f deployment/mailsender-frontend

# Ver logs do container anterior (se reiniciou)
kubectl logs deployment/mailsender-frontend --previous
```

### Verificar ConfigMap

```bash
# Ver ConfigMap completo
kubectl get configmap mailsender-frontend-env -o yaml

# Ver apenas os dados
kubectl get configmap mailsender-frontend-env -o jsonpath='{.data}' | jq
```

### Erro de conexão com API

1. Verifique se o backend está rodando:
```bash
kubectl get pods -l app=api-mailsender
```

2. Teste a conexão do frontend com o backend:
```bash
# Verificar se o backend está disponível
kubectl get svc mailsender-backend

# Entrar no pod do frontend
kubectl exec -it deployment/mailsender-frontend -- sh

# Dentro do pod, testar:
curl http://mailsender-backend/api
curl https://mailsender-backend.app.fslab.dev/api
```

3. Verifique as variáveis de ambiente:
```bash
kubectl exec -it deployment/front-mailsender -- env | grep API
```

### Erro 500 ou página em branco

```bash
# Ver logs detalhados
kubectl logs -f deployment/front-mailsender

# Verificar se o build foi feito corretamente
kubectl exec -it deployment/front-mailsender -- ls -la /app/.next
```

## Limpar Recursos

Para remover o frontend:

```bash
kubectl delete -f deploy-frontend.yaml
kubectl delete -f frontend-configmap.yaml
```

## Monitoramento

Ver métricas de recursos:

```bash
# Uso de CPU e memória
kubectl top pod -l app=mailsender-frontend
```

## Rollback

Se precisar desfazer uma atualização:

```bash
# Ver histórico de rollouts
kubectl rollout history deployment/mailsender-frontend

# Fazer rollback para a versão anterior
kubectl rollout undo deployment/mailsender-frontend

# Ou rollback para uma revisão específica
kubectl rollout undo deployment/mailsender-frontend --to-revision=2
```

## Notas Importantes

1. **Build-time vs Runtime**: A variável `NEXT_PUBLIC_API_URI` precisa ser definida durante o build da imagem
2. **NextAuth**: Certifique-se de que `NEXTAUTH_URL` corresponda à URL pública real do frontend
3. **HTTPS**: Em produção, sempre use HTTPS tanto para API quanto para frontend
4. **CORS**: Configure o backend para aceitar requisições do domínio do frontend
5. **Nome do Serviço**: O serviço fica exposto como `mailsender` no cluster
6. **Recursos**: Os limits de memória/CPU estão configurados - ajuste conforme necessário

## Integração com Backend

Certifique-se de que:

1. O backend está deployado e acessível em `api-mailsender:80` dentro do cluster
2. O backend tem CORS configurado para aceitar o domínio do frontend
3. As URLs em `frontend-configmap.yaml` estão corretas:
   - `NEXT_PUBLIC_API_URI` - URL pública que o navegador usa
   - `NEXTAUTH_URL` - URL pública do frontend

## Checklist de Deploy

- [ ] Backend deployado e funcionando
- [ ] ConfigMap criado com URLs corretas
- [ ] Secret do NextAuth gerado
- [ ] Imagem Docker construída com a URL da API correta
- [ ] Imagem enviada para Docker Hub
- [ ] Deploy aplicado no Kubernetes
- [ ] Pod rodando sem erros
- [ ] Ingress configurado (se necessário)
- [ ] Acesso externo funcionando
- [ ] Login/autenticação funcionando
- [ ] Comunicação com API funcionando
