# Deploy Frontend - Mail Sender

## Pré-requisitos

- Cluster Kubernetes configurado
- `kubectl` instalado e configurado
- Docker instalado (para build da imagem)
- Backend do mailsender já deployado
- Conta no Docker Hub (ou outro registry)

## 1. Build e Push da Imagem

```bash
cd /Users/ruanlopes/Documents/mailsender/frontend

# Build da imagem com a URL da API
# ⚠️ IMPORTANTE: A URL da API deve ser a URL PÚBLICA acessível pelo navegador do usuário
docker build \
  --build-arg NEXT_PUBLIC_API_URI=https://api-mailsender.app.fslab.dev/api \
  -t ruanlopes1350/mailsender-frontend:latest .

# Push para o Docker Hub
docker push ruanlopes1350/mailsender-frontend:latest
```

**Nota**: Ajuste o nome da imagem (`ruanlopes1350`) para o seu usuário do Docker Hub.

### ⚠️ Importante sobre NEXT_PUBLIC_API_URI

A variável `NEXT_PUBLIC_API_URI` é **build-time** no Next.js. Isso significa:

- ✅ Deve ser definida no `docker build` com `--build-arg`
- ✅ Deve ser a URL PÚBLICA da API (acessível pelo navegador)
- ❌ NÃO usar URL interna do Kubernetes (como `http://mailsender-backend`)
- ❌ NÃO pode ser alterada depois do build

**Exemplos corretos:**
```bash
# Produção
--build-arg NEXT_PUBLIC_API_URI=https://api-mailsender.seudominio.com/api

# Desenvolvimento com port-forward
--build-arg NEXT_PUBLIC_API_URI=http://localhost:5016/api
```

## 2. Configurar Variáveis de Ambiente

Edite o arquivo `frontend-configmap.yaml` e ajuste:

```yaml
# URL pública da API (deve ser acessível pelo navegador do usuário)
NEXT_PUBLIC_API_URI: "https://api-mailsender.app.fslab.dev/api"
```

## 3. Deploy no Kubernetes

```bash
cd /Users/ruanlopes/Documents/mailsender/frontend/deploy

# 1. Frontend ConfigMap
kubectl apply -f frontend-configmap.yaml

# 2. Frontend Deployment
kubectl apply -f deploy-frontend.yaml
```

## 4. Verificar Status

```bash
# Verificar pods
kubectl get pods | grep mailsender-frontend

# Logs do frontend
kubectl logs -f deployment/mailsender-frontend

# Status detalhado
kubectl describe deployment mailsender-frontend

# Testar dentro do cluster
kubectl run -it --rm debug --image=curlimages/curl --restart=Never -- \
  curl http://mailsender-frontend/
```

## 5. Expor o Frontend

### Port Forward (desenvolvimento/teste)
```bash
kubectl port-forward service/mailsender-frontend 3000:80
# Acesse: http://localhost:3000
```

### Ingress (produção)

Crie um arquivo `ingress.yaml`:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: mailsender-ingress
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - mailsender.app.fslab.dev
        - api-mailsender.app.fslab.dev
      secretName: mailsender-tls
  rules:
    # Frontend
    - host: mailsender.app.fslab.dev
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: mailsender-frontend
                port:
                  number: 80
    
    # Backend API
    - host: api-mailsender.app.fslab.dev
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: mailsender-backend
                port:
                  number: 80
```

Aplique:
```bash
kubectl apply -f ingress.yaml
```

## 6. Atualizar a Aplicação

### Alterações no Código (sem mudança na API URL)

```bash
# 1. Build da nova versão com a mesma URL da API
docker build \
  --build-arg NEXT_PUBLIC_API_URI=https://api-mailsender.app.fslab.dev/api \
  -t ruanlopes1350/mailsender-frontend:latest .

docker push ruanlopes1350/mailsender-frontend:latest

# 2. Forçar atualização
kubectl rollout restart deployment/mailsender-frontend

# 3. Acompanhar o rollout
kubectl rollout status deployment/mailsender-frontend
```

### Alteração da URL da API

Se você mudar o domínio da API, precisará:

```bash
# 1. Atualizar o ConfigMap
kubectl edit configmap mailsender-frontend-env
# Ou editar frontend-configmap.yaml e aplicar:
kubectl apply -f frontend-configmap.yaml

# 2. Rebuild com a nova URL
docker build \
  --build-arg NEXT_PUBLIC_API_URI=https://nova-api-url.com/api \
  -t ruanlopes1350/mailsender-frontend:latest .

docker push ruanlopes1350/mailsender-frontend:latest

# 3. Restart do deployment
kubectl rollout restart deployment/mailsender-frontend
```

## 7. Remover Deploy

```bash
kubectl delete -f deploy-frontend.yaml
kubectl delete -f frontend-configmap.yaml
```

## Estrutura de Arquivos

```
frontend/deploy/
├── README.md                        # Este arquivo
├── frontend-configmap.example.yaml  # Exemplo de configuração
├── frontend-configmap.yaml          # Configuração real
└── deploy-frontend.yaml             # Deployment + Service do frontend
```

## URLs de Acesso

- **Frontend**: `http://mailsender-frontend:80` (interno ao cluster)
- **Frontend Público**: `https://mailsender.app.fslab.dev` (após configurar Ingress)
- **API Pública**: `https://api-mailsender.app.fslab.dev` (configurada no build)

## Recursos Alocados

### Frontend
- **Requests**: 256Mi RAM, 0.25 CPU
- **Limits**: 512Mi RAM, 0.5 CPU
- **Storage**: Não requer (stateless)

## Troubleshooting

### Pod não inicia
```bash
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

### Erro "Cannot connect to API"

Verifique se a URL da API no build está correta:

```bash
# Verificar variáveis de ambiente dentro do pod
kubectl exec -it deployment/mailsender-frontend -- env | grep NEXT_PUBLIC

# A variável NEXT_PUBLIC_API_URI deve ser a URL PÚBLICA da API
```

Se a URL estiver errada, você precisa fazer rebuild:

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_URI=https://api-mailsender.app.fslab.dev/api \
  -t ruanlopes1350/mailsender-frontend:latest .
docker push ruanlopes1350/mailsender-frontend:latest
kubectl rollout restart deployment/mailsender-frontend
```

### Erro de CORS

Se você receber erro de CORS, verifique:

1. **Backend está configurado corretamente**:
```bash
kubectl logs -f deployment/mailsender-backend
```

2. **URL da API está correta** (deve incluir `/api`):
```
✅ https://api-mailsender.app.fslab.dev/api
❌ https://api-mailsender.app.fslab.dev
```

### Frontend carrega mas não conecta à API

1. **Verificar se o backend está rodando**:
```bash
kubectl get pods | grep mailsender-backend
```

2. **Testar a API diretamente**:
```bash
curl https://api-mailsender.app.fslab.dev/api
```

3. **Verificar logs do backend**:
```bash
kubectl logs -f deployment/mailsender-backend
```

## Segurança

- Container roda com usuário não-root (UID 1001)
- Capabilities DROP ALL aplicadas
- Security context configurado
- Sem escrita no root filesystem
- Health checks configurados

## Deploy Completo (Frontend + Backend)

Para fazer o deploy completo do mailsender:

```bash
# 1. Backend (na ordem)
cd /Users/ruanlopes/Documents/mailsender/backend/deploy
kubectl apply -f deploy-mongodb.yaml
kubectl apply -f deploy-redis.yaml
kubectl apply -f backend-configmap.yaml
kubectl apply -f deploy-backend.yaml

# Aguardar backend estar pronto
kubectl wait --for=condition=ready pod -l app=mailsender-backend --timeout=120s

# 2. Frontend
cd /Users/ruanlopes/Documents/mailsender/frontend/deploy
kubectl apply -f frontend-configmap.yaml
kubectl apply -f deploy-frontend.yaml

# 3. Ingress (opcional)
kubectl apply -f ingress.yaml
```

## Monitoramento

```bash
# Ver todos os recursos do mailsender
kubectl get all | grep mailsender

# Logs em tempo real
kubectl logs -f deployment/mailsender-frontend
kubectl logs -f deployment/mailsender-backend

# Status dos serviços
kubectl get svc | grep mailsender
```

## Próximos Passos

1. Configurar Ingress para HTTPS
2. Configurar certificados SSL com cert-manager
3. Implementar monitoramento com Prometheus
4. Configurar CI/CD para deploys automáticos
5. Configurar backup automático (backend)
6. Implementar rate limiting no Ingress
