'use client';

export default function TutorialPage() {
    const API_URL = process.env.NEXT_PUBLIC_API_URI || 'http://localhost:5016/api';

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copiado para a área de transferência!');
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-t-4 border-indigo-600">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        📧 Tutorial: Mail Sender API
                    </h1>
                    <p className="text-lg text-gray-600">
                        Guia completo para integrar o sistema de envio de emails ao seu projeto
                    </p>
                    <div className="mt-4 bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded">
                        <p className="text-sm font-mono text-indigo-900">
                            <strong>URL da API:</strong> {API_URL}
                        </p>
                    </div>
                </div>

                {/* Autenticação */}
                <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        🔐 Autenticação
                    </h2>
                    
                    <div className="space-y-6">
                        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
                            <h3 className="text-xl font-semibold text-yellow-900 mb-3">
                                ⚠️ API Key Obrigatória
                            </h3>
                            <p className="text-gray-700 mb-4">
                                Para usar a API e enviar emails, você precisa de uma <strong>API Key</strong>. 
                                Faça seu cadastro gratuito para gerar sua chave automaticamente.
                            </p>
                            <div className="bg-white p-4 rounded border border-yellow-200">
                                <p className="text-sm font-mono text-gray-800">
                                    <strong>Header obrigatório:</strong><br/>
                                    <code className="text-indigo-600">x-api-key: "SUA_CHAVE_AQUI"</code>
                                </p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-600 p-6 rounded-lg">
                            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                🚀 Como obter sua API Key:
                            </h4>
                            <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-4 mb-4">
                                <li>Acesse a página de <a href="/cadastro" className="text-indigo-600 hover:text-indigo-800 font-semibold underline">Cadastro</a></li>
                                <li>Preencha seus dados (nome, email e senha)</li>
                                <li>Clique em &quot;Cadastrar&quot;</li>
                                <li>Sua <strong>API Key será gerada e exibida na tela</strong></li>
                                <li className="text-red-600 font-semibold">⚠️ COPIE E GUARDE A CHAVE IMEDIATAMENTE! Ela não será exibida novamente</li>
                            </ol>
                            <div className="bg-white p-4 rounded border border-indigo-200">
                                <p className="text-sm text-gray-700">
                                    💡 <strong>Importante:</strong> Guarde sua API Key em local seguro (ex: variável de ambiente). Se perdê-la, será necessário criar uma nova conta.
                                </p>
                            </div>
                        </div>

                        <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-lg">
                            <h4 className="text-lg font-semibold text-amber-900 mb-3">
                                🚧 Consultar Histórico (Em Construção)
                            </h4>
                            <p className="text-gray-700 mb-3">
                                Em breve, você poderá consultar todos os emails que enviou usando sua API Key através de uma nova tela dedicada.
                            </p>
                            <p className="text-sm text-gray-600 italic">
                                Esta funcionalidade está em desenvolvimento e será liberada em breve.
                            </p>
                        </div>

                        <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-lg">
                            <h4 className="text-lg font-semibold text-purple-900 mb-3">
                                🔐 Sobre o Login
                            </h4>
                            <p className="text-gray-700">
                                A tela de <strong>Login</strong> é reservada exclusivamente para <strong>administradores do sistema</strong>. 
                                Usuários comuns não precisam fazer login - basta usar sua API Key para enviar emails via API.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Endpoints */}
                <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">📡 Endpoints Principais</h2>
                    
                    <div className="space-y-4">
                        <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">POST</span>
                                <code className="text-gray-800 font-mono text-sm">/emails/send</code>
                            </div>
                            <p className="text-gray-600 text-sm">Enviar um email usando templates personalizados</p>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">GET</span>
                                <code className="text-gray-800 font-mono text-sm">/emails/meus</code>
                            </div>
                            <p className="text-gray-600 text-sm">Listar emails enviados com sua API Key</p>
                        </div>
                    </div>
                </section>

                {/* Template Bem-vindo */}
                <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">🎉 Template: Bem-vindo</h2>
                    <p className="text-gray-600 mb-6">
                        Email de boas-vindas profissional e personalizável com botão opcional.
                    </p>

                    <div className="space-y-6">
                        {/* Exemplo Básico */}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Exemplo Básico</h3>
                            <div className="bg-gray-50 rounded-lg p-6 relative">
                                <button 
                                    onClick={() => copyToClipboard(`curl -X POST ${API_URL}/emails/send \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: SUA_CHAVE_AQUI" \\
  -d '{
    "to": "usuario@exemplo.com",
    "subject": "Bem-vindo!",
    "template": "bemvindo",
    "data": {
      "nomeSistema": "Meu Sistema",
      "nome": "João Silva"
    }
  }'`)}
                                    className="absolute top-4 right-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Copiar
                                </button>
                                <pre className="text-sm overflow-x-auto">
                                    <code className="text-gray-800">{`curl -X POST ${API_URL}/emails/send \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: SUA_CHAVE_AQUI" \\
  -d '{
    "to": "usuario@exemplo.com",
    "subject": "Bem-vindo!",
    "template": "bemvindo",
    "data": {
      "nomeSistema": "Meu Sistema",
      "nome": "João Silva"
    }
  }'`}</code>
                                </pre>
                            </div>
                        </div>

                        {/* Exemplo Completo */}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Exemplo Completo (Com Botão)</h3>
                            <div className="bg-gray-50 rounded-lg p-6 relative">
                                <button 
                                    onClick={() => copyToClipboard(`{
  "to": "usuario@exemplo.com",
  "subject": "Bem-vindo ao Sistema!",
  "template": "bemvindo",
  "data": {
    "nomeSistema": "Meu Sistema",
    "nome": "João Silva",
    "mensagem": "Estamos felizes em tê-lo conosco!",
    "mensagemSecundaria": "Para começar, explore nossos recursos.",
    "itens": [
      "Acesso ilimitado a todos os recursos",
      "Suporte técnico 24/7",
      "Atualizações gratuitas"
    ],
    "mostrarBotao": true,
    "textoBotao": "Acessar Minha Conta",
    "urlBotao": "https://seusite.com/login",
    "corPrimaria": "#4F46E5",
    "corBotao": "#10B981"
  }
}`)}
                                    className="absolute top-4 right-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Copiar JSON
                                </button>
                                <pre className="text-sm overflow-x-auto">
                                    <code className="text-gray-800">{`{
  "to": "usuario@exemplo.com",
  "subject": "Bem-vindo ao Sistema!",
  "template": "bemvindo",
  "data": {
    "nomeSistema": "Meu Sistema",
    "nome": "João Silva",
    "mensagem": "Estamos felizes em tê-lo conosco!",
    "mensagemSecundaria": "Para começar, explore nossos recursos.",
    "itens": [
      "Acesso ilimitado a todos os recursos",
      "Suporte técnico 24/7",
      "Atualizações gratuitas"
    ],
    "mostrarBotao": true,
    "textoBotao": "Acessar Minha Conta",
    "urlBotao": "https://seusite.com/login",
    "corPrimaria": "#4F46E5",
    "corBotao": "#10B981"
  }
}`}</code>
                                </pre>
                            </div>
                        </div>

                        {/* Tabela de Campos */}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Campos Disponíveis</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full border border-gray-200 rounded-lg">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Campo</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Tipo</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Descrição</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-mono text-indigo-600">nomeSistema</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">string</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">Nome do sistema/empresa</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-mono text-indigo-600">nome</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">string</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">Nome do destinatário</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-mono text-indigo-600">mensagem</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">string/HTML</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">Mensagem principal customizada</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-mono text-indigo-600">mensagemSecundaria</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">string/HTML</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">Texto adicional</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-mono text-indigo-600">itens</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">array</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">Lista de benefícios/recursos</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-mono text-indigo-600">mostrarBotao</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">boolean</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">Exibir ou ocultar botão</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-mono text-indigo-600">textoBotao</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">string</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">Texto do botão</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-mono text-indigo-600">urlBotao</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">string</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">URL do botão</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-mono text-indigo-600">corPrimaria</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">string</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">Cor do header em hex (ex: &quot;#4F46E5&quot;)</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-mono text-indigo-600">corBotao</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">string</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">Cor do botão em hex</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-mono text-indigo-600">logoUrl</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">string</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">URL do logo da empresa</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Template Genérico */}
                <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">📨 Template: Genérico</h2>
                    <p className="text-gray-600 mb-6">
                        Template versátil para notificações, confirmações, alertas e muito mais.
                    </p>

                    <div className="space-y-6">
                        {/* Exemplo Confirmação de Pedido */}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Exemplo: Confirmação de Pedido</h3>
                            <div className="bg-gray-50 rounded-lg p-6 relative">
                                <button 
                                    onClick={() => copyToClipboard(`{
  "to": "cliente@exemplo.com",
  "subject": "Pedido Confirmado #12345",
  "template": "generico",
  "data": {
    "mostrarHeader": true,
    "nomeSistema": "Loja Online",
    "titulo": "Pedido Confirmado! 🎉",
    "subtitulo": "Pedido #12345",
    "nome": "Maria Santos",
    "mensagem": "Seu pedido foi confirmado e está sendo processado.",
    "textoDestaque": "⏱️ <strong>Previsão de entrega:</strong> 3-5 dias úteis",
    "dados": [
      { "label": "Número do Pedido", "valor": "#12345" },
      { "label": "Data", "valor": "08/10/2025" },
      { "label": "Valor Total", "valor": "R$ 299,90" }
    ],
    "mostrarBotao": true,
    "textoBotao": "Rastrear Pedido",
    "urlBotao": "https://loja.com/rastreio/12345"
  }
}`)}
                                    className="absolute top-4 right-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Copiar JSON
                                </button>
                                <pre className="text-sm overflow-x-auto">
                                    <code className="text-gray-800">{`{
  "to": "cliente@exemplo.com",
  "subject": "Pedido Confirmado #12345",
  "template": "generico",
  "data": {
    "mostrarHeader": true,
    "nomeSistema": "Loja Online",
    "titulo": "Pedido Confirmado! 🎉",
    "subtitulo": "Pedido #12345",
    "nome": "Maria Santos",
    "mensagem": "Seu pedido foi confirmado e está sendo processado.",
    "textoDestaque": "⏱️ <strong>Previsão:</strong> 3-5 dias úteis",
    "dados": [
      { "label": "Número do Pedido", "valor": "#12345" },
      { "label": "Data", "valor": "08/10/2025" },
      { "label": "Valor Total", "valor": "R$ 299,90" }
    ],
    "mostrarBotao": true,
    "textoBotao": "Rastrear Pedido",
    "urlBotao": "https://loja.com/rastreio/12345"
  }
}`}</code>
                                </pre>
                            </div>
                        </div>

                        {/* Exemplo Notificação */}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Exemplo: Notificação Simples</h3>
                            <div className="bg-gray-50 rounded-lg p-6 relative">
                                <button 
                                    onClick={() => copyToClipboard(`{
  "to": "usuario@exemplo.com",
  "subject": "Nova Atualização Disponível",
  "template": "generico",
  "data": {
    "titulo": "Nova Funcionalidade! 🚀",
    "mensagem": "Implementamos melhorias na plataforma.",
    "itens": [
      "Interface redesenhada",
      "Novos relatórios analíticos",
      "Melhor desempenho"
    ],
    "mostrarBotao": true,
    "textoBotao": "Conferir Novidades",
    "urlBotao": "https://app.com/novidades"
  }
}`)}
                                    className="absolute top-4 right-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Copiar JSON
                                </button>
                                <pre className="text-sm overflow-x-auto">
                                    <code className="text-gray-800">{`{
  "to": "usuario@exemplo.com",
  "subject": "Nova Atualização Disponível",
  "template": "generico",
  "data": {
    "titulo": "Nova Funcionalidade! 🚀",
    "mensagem": "Implementamos melhorias na plataforma.",
    "itens": [
      "Interface redesenhada",
      "Novos relatórios analíticos",
      "Melhor desempenho"
    ],
    "mostrarBotao": true,
    "textoBotao": "Conferir Novidades",
    "urlBotao": "https://app.com/novidades"
  }
}`}</code>
                                </pre>
                            </div>
                        </div>

                        {/* Tabela de Campos */}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Principais Campos</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full border border-gray-200 rounded-lg">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Campo</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Tipo</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Descrição</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-mono text-indigo-600">titulo</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">string</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">Título principal do email</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-mono text-indigo-600">subtitulo</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">string</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">Subtítulo abaixo do título</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-mono text-indigo-600">nome</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">string</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">Nome para saudação</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-mono text-indigo-600">mensagem</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">string/HTML</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">Conteúdo principal</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-mono text-indigo-600">textoDestaque</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">string/HTML</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">Texto em caixa destacada</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-mono text-indigo-600">itens</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">array</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">Lista de itens (bullets)</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-mono text-indigo-600">dados</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">array</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">Tabela de dados [&#123;label, valor&#125;]</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-mono text-indigo-600">mostrarBotao</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">boolean</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">Exibir botão principal</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-mono text-indigo-600">mostrarBotaoSecundario</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">boolean</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">Exibir segundo botão</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-mono text-indigo-600">nota</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">string/HTML</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">Nota/aviso no final</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Exemplos de Código */}
                <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">💻 Exemplos de Integração</h2>

                    <div className="space-y-6">
                        {/* JavaScript */}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">JavaScript (Fetch API)</h3>
                            <div className="bg-gray-50 rounded-lg p-6 relative">
                                <button 
                                    onClick={() => copyToClipboard(`async function enviarEmail() {
  const response = await fetch('${API_URL}/emails/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'SUA_CHAVE_AQUI'
    },
    body: JSON.stringify({
      to: 'usuario@exemplo.com',
      subject: 'Bem-vindo!',
      template: 'bemvindo',
      data: {
        nomeSistema: 'Meu App',
        nome: 'João',
        mostrarBotao: true,
        textoBotao: 'Começar',
        urlBotao: 'https://app.com/login'
      }
    })
  });

  const result = await response.json();
  console.log(result);
}`)}
                                    className="absolute top-4 right-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Copiar
                                </button>
                                <pre className="text-sm overflow-x-auto">
                                    <code className="text-gray-800">{`async function enviarEmail() {
  const response = await fetch('${API_URL}/emails/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'SUA_CHAVE_AQUI'
    },
    body: JSON.stringify({
      to: 'usuario@exemplo.com',
      subject: 'Bem-vindo!',
      template: 'bemvindo',
      data: {
        nomeSistema: 'Meu App',
        nome: 'João',
        mostrarBotao: true,
        textoBotao: 'Começar',
        urlBotao: 'https://app.com/login'
      }
    })
  });

  const result = await response.json();
  console.log(result);
}`}</code>
                                </pre>
                            </div>
                        </div>

                        {/* Python */}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Python (Requests)</h3>
                            <div className="bg-gray-50 rounded-lg p-6 relative">
                                <button 
                                    onClick={() => copyToClipboard(`import requests

def enviar_email():
    url = '${API_URL}/emails/send'
    headers = {
        'Content-Type': 'application/json',
        'x-api-key': 'SUA_CHAVE_AQUI'
    }
    data = {
        'to': 'usuario@exemplo.com',
        'subject': 'Bem-vindo!',
        'template': 'bemvindo',
        'data': {
            'nomeSistema': 'Meu Sistema',
            'nome': 'Maria',
            'mostrarBotao': True,
            'textoBotao': 'Acessar',
            'urlBotao': 'https://app.com'
        }
    }

    response = requests.post(url, json=data, headers=headers)
    print(response.json())

enviar_email()`)}
                                    className="absolute top-4 right-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Copiar
                                </button>
                                <pre className="text-sm overflow-x-auto">
                                    <code className="text-gray-800">{`import requests

def enviar_email():
    url = '${API_URL}/emails/send'
    headers = {
        'Content-Type': 'application/json',
        'x-api-key': 'SUA_CHAVE_AQUI'
    }
    data = {
        'to': 'usuario@exemplo.com',
        'subject': 'Bem-vindo!',
        'template': 'bemvindo',
        'data': {
            'nomeSistema': 'Meu Sistema',
            'nome': 'Maria',
            'mostrarBotao': True,
            'textoBotao': 'Acessar',
            'urlBotao': 'https://app.com'
        }
    }

    response = requests.post(url, json=data, headers=headers)
    print(response.json())

enviar_email()`}</code>
                                </pre>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Respostas */}
                <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">✅ Respostas da API</h2>

                    <div className="space-y-4">
                        <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded">
                            <h3 className="text-lg font-semibold text-green-900 mb-2">Sucesso (202)</h3>
                            <pre className="text-sm bg-white p-3 rounded border border-green-200 overflow-x-auto">
                                <code className="text-gray-800">{`{
  "message": "E-mail enfileirado",
  "info": {
    "accepted": ["usuario@exemplo.com"],
    "messageId": "<abc123@servidor.com>"
  }
}`}</code>
                            </pre>
                        </div>

                        <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded">
                            <h3 className="text-lg font-semibold text-red-900 mb-2">Erro - API Key Inválida (401)</h3>
                            <pre className="text-sm bg-white p-3 rounded border border-red-200 overflow-x-auto">
                                <code className="text-gray-800">{`{
  "message": "API key inválida ou não fornecida"
}`}</code>
                            </pre>
                        </div>

                        <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded">
                            <h3 className="text-lg font-semibold text-yellow-900 mb-2">Erro - Dados Inválidos (500)</h3>
                            <pre className="text-sm bg-white p-3 rounded border border-yellow-200 overflow-x-auto">
                                <code className="text-gray-800">{`{
  "message": "Falha ao enviar e-mail",
  "error": "Template não encontrado"
}`}</code>
                            </pre>
                        </div>
                    </div>
                </section>

                {/* Dicas */}
                <section className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
                    <h2 className="text-3xl font-bold mb-6">💡 Dicas Importantes</h2>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                            <span className="text-2xl">🔑</span>
                            <span>Sempre mantenha sua API Key em local seguro (variáveis de ambiente)</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-2xl">🎨</span>
                            <span>Use cores em formato hexadecimal (ex: &quot;#4F46E5&quot;) para personalizar</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-2xl">📝</span>
                            <span>Os campos suportam HTML - use tags como &lt;strong&gt;, &lt;em&gt;, &lt;br&gt;</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-2xl">✉️</span>
                            <span>Teste seus emails antes de enviar para usuários reais</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-2xl">📊</span>
                            <span>Monitore seus envios através do painel administrativo</span>
                        </li>
                    </ul>
                </section>
            </div>
        </main>
    );
}