"use client";

import { useState } from "react";
import Tab from "@/components/tab";
import CardInfo from "@/components/card-info";
import Link from "next/link";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGeneralStats, useApiKeys, useDeactivateApiKey, useReactivateApiKey, useRevokeApiKey, useEmailDetails } from "@/hooks/useData";
import { formatDate, EmailStatusBadge, ApiKeyStatusBadge, HttpMethodBadge, StatusCodeBadge } from "@/components/badges";
import Button from "@/components/button";
import Modal from "@/components/modal";
import Input from "@/components/input";
import { IZodError } from "@/types/interfaces";
import { ZodError } from "zod";
import { apiKeySchema } from "../validations/apiKey";
import { useGenerateApiKey } from "@/hooks/useData"
import { ApiKey, GenerateApiKeyResponse } from "@/types/api";
import { generatePdf } from "@/utils/generatePdf";


export default function Home() {
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("Dashboard");
  const [footerLinks, setFooterLinks] = useState(false);
  const [botaoLink, setBotaoLink] = useState<boolean>(false);
  const [botaoLink2, setBotaoLink2] = useState<boolean>(false);
  const [templateAtivo, setTemplateAtivo] = useState<string>('')
  const [chaveParaExcluir, setChaveParaExcluir] = useState<ApiKey | null>(null);

  // Busca dados da API
  const { data: stats, isLoading: loadingStats, error: errorStats } = useGeneralStats();
  const { data: apiKeys, isLoading: loadingKeys, error: errorKeys } = useApiKeys();

  // Mutations para gerenciar API Keys
  const deactivateMutation = useDeactivateApiKey();
  const reactivateMutation = useReactivateApiKey();
  const revokeApiMutation = useRevokeApiKey();

  // Atualiza o status da chave API
  const inativarChave = async (keyNome: string) => {
    try {
      await deactivateMutation.mutateAsync(keyNome);
    } catch (error) {
      console.error('Erro ao desativar chave API:', error);
    }
  };

  const reativarChave = async (keyNome: string) => {
    try {
      await reactivateMutation.mutateAsync(keyNome);
    } catch (error) {
      console.error('Erro ao reativar chave API:', error);
    }
  };

  // Desativar Chave API
  const deletarChave = async (keyNome: string) => {
    try {
      await revokeApiMutation.mutateAsync(keyNome);
    } catch (error) {
      console.error('Erro ao deletar chave API:', error)
    }
  }

  // Gerar nova API Key
  const [nameAPI, setNameAPI] = useState('');
  const [emailAPI, setEmailAPI] = useState('');
  const [passAPI, setPassAPI] = useState('');

  const [isLoadingAPI, setIsLoadingAPI] = useState(false);
  const [errorAPI, setErrorAPI] = useState<IZodError[] | null>(null);
  const [respostaAPI, setRespostaAPI] = useState<GenerateApiKeyResponse | null>(null);
  const [copiadoAPI, setCopiadoAPI] = useState(false);
  const generateApiKey = useGenerateApiKey();

  const [emailId, setEmailId] = useState<string>('');
  const [modalEmailAberto, setModalEmailAberto] = useState<boolean>(false);

  // Busca detalhes apenas quando o modal está aberto
  const { data: emailDetails, isLoading: loadingEmailDetails } = useEmailDetails(emailId, modalEmailAberto);

  const gerarApiKey = async (name: string, email: string, pass: string) => {
    setErrorAPI(null);
    setIsLoadingAPI(true);

    const apiKey = {
      nome: name,
      email: email,
      senha: pass
    }

    try {
      apiKeySchema.parse(apiKey)
      let responseAPI = await generateApiKey.mutateAsync({ name, email, pass });
      setRespostaAPI(responseAPI);
    } catch (error: any) {
      if (error instanceof ZodError) {
        const mensagensErro: IZodError[] = error.issues.map(err => {
          console.log(err.message)
          return {
            mensagem: err.message
          };
        });
        setErrorAPI(mensagensErro);
      } else {
        setErrorAPI([{ mensagem: error.message || 'Erro ao gerar API Key' }]);
      }
    } finally {
      setIsLoadingAPI(false);
    }
  }

  const copiarParaClipboard = async () => {
    try {
      await navigator.clipboard.writeText(respostaAPI?.apiKey || '');
      setCopiadoAPI(true);
      // Reseta após 2 segundos
      setTimeout(() => setCopiadoAPI(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
      alert('Erro ao copiar. Tente selecionar e copiar manualmente.');
    }
  }

  const abrirModalDetalhes = (id: string) => {
    setEmailId(id);
    setModalEmailAberto(true);
    setActiveModal('detailsEmailsModal');
  }

  const fecharModalDetalhes = () => {
    setModalEmailAberto(false);
    setEmailId('');
    setActiveModal(null);
  }

  // Debug
  console.log('Stats:', stats);
  console.log('Loading Stats:', loadingStats);
  console.log('Error Stats:', errorStats);
  console.log('API Keys:', apiKeys);
  console.log('Loading Keys:', loadingKeys);
  console.log('Error Keys:', errorKeys);

  return (
    <>
      {/* modal zone */}
      <Modal
        titulo="Adicionar Nova Chave de API"
        isOpen={activeModal === 'novaApi'}
        onClose={() => setActiveModal(null)}
      >
        {respostaAPI ? (
          <>
            <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-[10px] p-4 sm:p-6">
              <h1 className="text-[#166534] font-bold text-sm sm:text-base">⚠ATENÇÃO:</h1>
              <p className="text-[#15803D] text-[10px] sm:text-[11px]">Guarde esta chave em local seguro. Ela não será mostrada novamente!</p>
              {respostaAPI.isActive === false && (
                <>
                  <span className="text-[#dc4109] text-[10px] sm:text-[11px]">Contate seu administrador para que ele aprove sua chave. Somente poderá ser usada após aprovada pelo Administrador!</span>
                </>
              )}
              <div className="h-[40px] sm:h-[44px] w-full bg-white rounded-[10px] flex items-center mt-3 sm:mt-4 mb-3 sm:mb-4 p-3 sm:p-4 overflow-hidden text-xs sm:text-sm">
                {respostaAPI.apiKey.substring(0, 29) + '...'}
              </div>
              <Button
                texto={copiadoAPI ? "✓ Copiado!" : "Copiar API Key"}
                cor={copiadoAPI ? "bg-[#059669]" : "bg-[#16A34A]"}
                hover="hover:bg-[#18592F]"
                altura="h-[42px] sm:h-[48px]"
                largura="w-full"
                margem="mb-3 sm:mb-5 mt-4 sm:mt-6"
                onClick={copiarParaClipboard}
              />
            </div>
            <Button texto="Voltar" cor="bg-[#4F46E5]" hover="hover:bg-[#231c9b]" largura="w-full" altura="h-[42px] sm:h-[48px]" margem="mb-3 sm:mb-5 mt-6 sm:mt-8 md:mt-10" onClick={() => setRespostaAPI(null)} />
          </>
        ) : (
          <>
            <div className="space-y-3 sm:space-y-4">
              <Input id="nome" label="Nome" type="text" placeholder="Meu Projeto" altura="h-[42px] sm:h-[50px]" largura="w-full" onChange={(e) => setNameAPI(e.target.value)} />
              <Input id="email" label="Email" type="email" placeholder="admin@example.com" altura="h-[42px] sm:h-[50px]" largura="w-full" onChange={(e) => setEmailAPI(e.target.value)} />
              <Input id="senha" label="Senha" type="text" placeholder="ABCD 1234 EFGH 5678" altura="h-[42px] sm:h-[50px]" largura="w-full" onChange={(e) => setPassAPI(e.target.value)} />
            </div>
            <Button
              texto={isLoadingAPI ? "Gerando..." : "Gerar API Key"}
              cor="bg-[#4F46E5]"
              hover="hover:bg-[#231c9b]"
              largura="w-full"
              altura="h-[42px] sm:h-[48px]"
              margem="mb-3 sm:mb-5 mt-6 sm:mt-8 md:mt-10"
              onClick={() => gerarApiKey(nameAPI, emailAPI, passAPI)}
            />
          </>
        )}
      </Modal>

      <Modal
        titulo="confirmar exclusão de chave" isOpen={activeModal === 'confirmDeleteApiKey'} onClose={() => setActiveModal(null)}
      >
        <div>Tem certeza que deseja excluir esta chave de API? Esta ação é irreversível.</div>
        <div className="flex flex-row gap-4 mt-6">
          <Button texto="Cancelar" cor="bg-gray-500" hover="hover:bg-gray-700" largura="w-full" altura="h-[42px] sm:h-[48px]" onClick={() => setActiveModal(null)} />
          <Button texto="Excluir" cor="bg-red-600" hover="hover:bg-red-800" largura="w-full" altura="h-[42px] sm:h-[48px]" onClick={() => { deletarChave(chaveParaExcluir?.nome || ''), setActiveModal(null) }} />
        </div>
      </Modal>

      <Modal titulo="Detalhes do Email" onClose={fecharModalDetalhes} isOpen={activeModal === 'detailsEmailsModal'}>
        {loadingEmailDetails ? (
          <div className="text-center p-10">Carregando detalhes...</div>
        ) : emailDetails ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-sm text-gray-600">Para:</label>
                <p className="text-gray-900">{emailDetails.to}</p>
              </div>
              <div>
                <label className="font-semibold text-sm text-gray-600">De:</label>
                <p className="text-gray-900">{emailDetails.sender || 'N/A'}</p>
              </div>
              <div>
                <label className="font-semibold text-sm text-gray-600">Assunto:</label>
                <p className="text-gray-900">{emailDetails.subject}</p>
              </div>
              <div>
                <label className="font-semibold text-sm text-gray-600">Template:</label>
                <p className="text-gray-900">{emailDetails.template}</p>
              </div>
              <div>
                <label className="font-semibold text-sm text-gray-600">Status:</label>
                <EmailStatusBadge status={emailDetails.status} />
              </div>
              <div>
                <label className="font-semibold text-sm text-gray-600">Criado em:</label>
                <p className="text-gray-900">{formatDate(emailDetails.createdAt)}</p>
              </div>
              {emailDetails.sentAt && (
                <div>
                  <label className="font-semibold text-sm text-gray-600">Enviado em:</label>
                  <p className="text-gray-900">{formatDate(emailDetails.sentAt)}</p>
                </div>
              )}
              {emailDetails.error && (
                <div className="col-span-2">
                  <label className="font-semibold text-sm text-red-600">Erro:</label>
                  <p className="text-red-900 bg-red-50 p-3 rounded-md">{emailDetails.error}</p>
                </div>
              )}
            </div>
            {emailDetails.data && (
              <div className="flex flex-col">
                <Button 
                  onClick={async () => {
                    try {
                      await generatePdf(emailDetails.data)
                    } catch (error) {
                      console.error('Erro ao gerar PDF:', error)
                    }
                  }} 
                  extraClassName="hover:bg-green-600" 
                  texto="📄 Baixar Corpo do E-Mail (PDF)" 
                  altura="h-[42px] sm:h-[48px]" 
                  largura="w-full" 
                  cor="bg-green-500" 
                />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-10 text-gray-500">Nenhum detalhe disponível</div>
        )}
      </Modal>

      <div className="flex flex-col md:flex-row gap-4 md:gap-24 px-4 md:px-16">
        <Tab icon='/dashboard' text='Dashboard' selected={activeTab === 'Dashboard'} onSelect={() => setActiveTab('Dashboard')} />
        <Tab icon='/keys' text='API Keys' selected={activeTab === 'API Keys'} onSelect={() => setActiveTab('API Keys')} />
        <Tab icon='/email' text='Testar Email' selected={activeTab === 'Testar Email'} onSelect={() => setActiveTab('Testar Email')} />
        <Tab icon='/logs' text='Logs Recentes' selected={activeTab === 'Logs Recentes'} onSelect={() => setActiveTab('Logs Recentes')} />
      </div>

      {/* Dashboard */}
      {activeTab === 'Dashboard' && (
        <div>
          {loadingStats ? (
            <div className="text-center p-10">Carregando...</div>
          ) : errorStats ? (
            <div className="text-center p-10 text-red-500">Erro ao carregar dados: {errorStats.message}</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 px-4 md:px-8 lg:px-18 pt-10 pb-10">
                <CardInfo icon='/emails-dash.png' number={stats?.emails.total || 0} description="Total de emails" />
                <CardInfo icon="/success-dash.png" number={stats?.emails.enviados || 0} description="Emails Enviados" />
                <CardInfo icon="/fail-dash.png" number={stats?.emails.falhas || 0} description="Emails Falhados" />
                <CardInfo icon="/logs-dash.png" number={stats?.requests.total || 0} description="Total de Requisições" />
              </div>

              <div className="bg-white rounded-2xl border p-4 md:p-10 mx-4 md:mx-17 overflow-x-auto">
                <div className="flex flex-row items-center gap-2">
                  <img className="h-[24px] w-[24px]" src="/recents-purple.png" draggable='false' />
                  <h1 className="font-bold text-2xl">Emails Recentes</h1>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Origem</TableHead>
                      <TableHead>Para</TableHead>
                      <TableHead>Assunto</TableHead>
                      <TableHead>Template</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats?.recentEmails && stats.recentEmails.length > 0 ? (
                      stats.recentEmails.map((email, index) => (
                        <TableRow className="cursor-pointer" onClick={() => abrirModalDetalhes(email._id)} key={email._id || `email-${index}`}>
                          <TableCell>{formatDate(email.createdAt)}</TableCell>
                          <TableCell>{email.sender}</TableCell>
                          <TableCell>{email.to}</TableCell>
                          <TableCell>{email.subject}</TableCell>
                          <TableCell>{email.template}</TableCell>
                          <TableCell className="flex flex-row items-center justify-items-start">
                            <EmailStatusBadge status={email.status} />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">Nenhum email encontrado</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                  <TableCaption><span className="cursor-pointer text-blue-700 hover:underline">Ver todos os emails</span></TableCaption>
                </Table>
              </div>
            </>
          )}
        </div>
      )}

      {/* API Keys */}
      {activeTab === 'API Keys' && (
        <div>
          <div className="bg-white rounded-2xl border mt-10 p-4 md:p-10 mx-4 md:mx-17 overflow-x-auto">
            <div className="flex flex-row items-center gap-2">
              <img className="h-[24px] w-[24px]" src="/recents-purple.png" draggable='false' />
              <h1 className="font-bold text-xl md:text-2xl">Gerenciar API Keys</h1>
            </div>
            <Button texto="Cadastrar Nova" cor="bg-green-600" altura="h-10" largura="w-36" margem="" onClick={() => setActiveModal('novaApi')} />
            {loadingKeys ? (
              <div className="text-center p-10">Carregando...</div>
            ) : errorKeys ? (
              <div className="text-center p-10 text-red-500">Erro ao carregar API Keys: {errorKeys.message}</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Prefixo</TableHead>
                    <TableHead>Criada em</TableHead>
                    <TableHead>Última vez utilizada</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys && apiKeys.length > 0 ? (
                    apiKeys.map((key, index) => (
                      <TableRow key={key._id || `apikey-${index}`}>
                        <TableCell>{key.nome}</TableCell>
                        <TableCell>{key.prefixo}</TableCell>
                        <TableCell>{formatDate(key.criadoEm)}</TableCell>
                        <TableCell>{key.ultimoUso ? formatDate(key.ultimoUso) : 'Nunca'}</TableCell>
                        <TableCell className="flex flex-row items-center justify-items-start">
                          <ApiKeyStatusBadge isActive={key.ativa} />
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-row gap-2">
                            <img className='cursor-pointer' src={key.ativa ? "/deactivate.png" : "/activate.png"} onClick={() => key.ativa ? inativarChave(key.nome) : reativarChave(key.nome)} draggable='false' />
                            <img className='cursor-pointer' src="/erase.png" onClick={() => { setChaveParaExcluir(key); setActiveModal('confirmDeleteApiKey'); }} draggable='false' />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">Nenhuma API Key encontrada</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      )}

      {/* Emails */}
      {activeTab === 'Testar Email' && (
        <div>
          <div className="bg-white rounded-2xl border mt-10 p-4 md:p-10 mx-4 md:mx-17 overflow-x-auto">
            <div className="flex flex-row items-center gap-2">
              <img className="h-[24px] w-[24px]" src="/email-purple.png" draggable='false' />
              <h1 className="font-bold text-xl md:text-2xl">Testar Envio de Email</h1>
            </div>
            <div className="flex flex-col gap-6">
              <div className="bg-[#F9FAFB] rounded-2xl p-6">
                <h2 className="font-bold text-black text-[18px]">Configurações Básicas</h2>
                <Input className="bg-white" id="apiKey" type="text" label="API Key *" altura="" largura="" placeholder="Digite sua API Key" />
                <Input className="bg-white" id="destinatario" type="email" label="Para (email) *" altura="" largura="" placeholder="destinatario@example.com" />
                <Input className="bg-white" id="assunto" type="text" label="Assunto *" altura="" largura="" placeholder="Assunto do E-mail" />
                <div className="bg-white flex flex-col mt-4 mb-4 gap-2">
                  <select onChange={(e) => { setTemplateAtivo(e.target.value) }} defaultValue="" className="p-4 rounded-[10px] border">
                    <option value="" disabled>Selecione um template</option>
                    <option value="bemvindo">Bem-Vindo</option>
                    <option value="generico">Genérico</option>
                  </select>
                </div>
              </div>

              {templateAtivo === '' && (
                <div className="text-center p-10 text-gray-500">Selecione um template para configurar os campos.</div>
              )}

              {templateAtivo === 'bemvindo' && (
                <>
                  <div className="bg-[#EEF2FF] rounded-2xl p-6">
                    <h2>Campos do Template: Bem-Vindo</h2>
                    <span>Todos os campos são opcionais, exceto os marcados com *</span>
                    <div className="flex flex-col gap-4 mt-4">
                      <div className="flex flex-col md:flex-row gap-6 w-full">
                        <div className="flex-1">
                          <Input className="bg-white" id="nomeSistema" type="text" label="Nome do Sistema" altura="" largura="w-full" placeholder="Ex: Meu Sistema" />
                        </div>
                        <div className="flex-1">
                          <Input className="bg-white" id="nomeDestinatario" type="text" label="Nome do Destinatário" altura="" largura="w-full" placeholder="Ex: João Silva" />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="mensagemPrincipal">Mensagem Principal</label>
                        <textarea id="mensagemPrincipal" className="bg-white w-full h-32 mt-4 p-4 border rounded-md resize-none" placeholder="Mensagem de Boas-Vindas personalizada"></textarea>
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="mensagemSecundaria">Mensagem Secundária</label>
                        <textarea id="mensagemSecundaria" className="bg-white w-full h-18 mt-4 p-4 border rounded-md resize-none" placeholder="Texto adicional após a mensagem principal"></textarea>
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="listaRecursos">Lista de Benefícios/Recursos (Separe por vírgulas)</label>
                        <textarea id="listaRecursos" className="bg-white w-full h-25 mt-4 p-4 border rounded-md resize-none" placeholder="Recurso 1, Recurso 2, Recurso 3..."></textarea>
                      </div>
                      <div className="bg-[#FDF2F8] p-4 rounded-2xl border border-[#C7D2FE] flex flex-col items-start w-full">
                        <div className="flex flex-row gap-2">
                          <input type="checkbox" name="exibirBotao" id="exibirBotao" checked={botaoLink} onChange={(e) => setBotaoLink(e.target.checked)} />
                          <label htmlFor="exibirBotao">Exibir Botão de Ação</label>
                        </div>
                        {botaoLink && (
                          <div className="flex flex-col md:flex-row gap-6 w-full">
                            <div className="flex-1">
                              <Input defaultValue="Começar Agora" className="bg-white" id="nomeSistema" type="text" label="Texto do Botão *" altura="" largura="w-full" placeholder="Ex: Começar Agora" />
                            </div>
                            <div className="flex-1">
                              <Input className="bg-white" id="nomeDestinatario" type="text" label="URL do Botão *" altura="" largura="w-full" placeholder="https://exemplo.com" />
                            </div>
                          </div>
                        )}
                      </div>
                      <label htmlFor="informacaoAdicional">Informações Adicionais</label>
                      <textarea id="informacaoAdicional" className="bg-white w-full h-18 mt-4 p-4 border rounded-md resize-none" placeholder="Informações extras antes do footer"></textarea>
                    </div>
                  </div>

                  <div className="bg-[#FAF5FF] rounded-2xl p-6">
                    <h2 className="font-bold text-black text-[18px]">Customização Visual</h2>
                    <Input className="bg-white" id="logoUrl" type="text" label="URL do Logo" altura="" largura="" placeholder="https://exemplo.com/logo.png" />
                    <div className="flex flex-row items-center justify-between">
                      <Input id="corHeader" type="color" label="Cor Primária (Header)" altura="h-16" largura="w-[500px]" placeholder="" />
                      <Input id="corBotao" type="color" label="Cor do Botão" altura="h-16" largura="w-[500px]" placeholder="" />
                      <Input id="corDestaque" type="color" label="Cor de Destaque" altura="h-16" largura="w-[500px]" placeholder="" />
                    </div>
                  </div>

                  <div className="bg-[#F9FAFB] rounded-2xl p-6">
                    <h2 className="font-bold text-black text-[18px]">Rodapé</h2>
                    <span>Texto do Footer</span>
                    <div className="flex flex-row gap-3 items-center">
                      <input type="checkbox" name="footerLinks" id="footerLinks" checked={footerLinks} onChange={(e) => setFooterLinks(e.target.checked)} />
                      <label htmlFor="footerLinks">Exibir Links no Footer</label>
                    </div>
                    {footerLinks && (
                      <div className="flex flex-row gap-6 items-center justify-between">
                        <Input className="bg-white" id="linkSite" type="text" label="Link do Site" altura="" largura="w-[500px]" placeholder="https://site.com" />
                        <Input className="bg-white" id="linkSuporte" type="text" label="Link do Suporte" altura="" largura="w-[500px]" placeholder="https://suporte.com" />
                        <Input className="bg-white" id="linkPrivacidade" type="text" label="Link Privacidade" altura="" largura="w-[500px]" placeholder="https://privacidade.com" />
                      </div>
                    )}
                  </div>
                </>
              )}

              {templateAtivo === 'generico' && (
                <>
                  <div className="bg-[#EEF2FF] rounded-2xl p-6">
                    <h2>Campos do Template: Genérico</h2>
                    <span>Todos os campos são opcionais, exceto os marcados com *</span>
                    <div className="flex flex-col gap-4 mt-4">
                      <div className="flex flex-col md:flex-row gap-6 w-full">
                        <div className="flex-1">
                          <Input className="bg-white" id="nomeSistema" type="text" label="Nome do Sistema" altura="" largura="w-full" placeholder="Ex: Meu Sistema" />
                        </div>
                        <div className="flex-1">
                          <Input className="bg-white" id="nomeDestinatario" type="text" label="Nome do Destinatário" altura="" largura="w-full" placeholder="Ex: João Silva" />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="mensagemPrincipal">Mensagem Principal</label>
                        <textarea id="mensagemPrincipal" className="bg-white w-full h-32 mt-4 p-4 border rounded-md resize-none" placeholder="Mensagem de Boas-Vindas personalizada"></textarea>
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="conteudoAdicional">Conteúdo Adicional</label>
                        <textarea id="conteudoAdicional" className="bg-white w-full h-18 mt-4 p-4 border rounded-md resize-none" placeholder="Texto adicional após a mensagem principal"></textarea>
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="textoDestaque">Texto em Destaque</label>
                        <textarea id="textoDestaque" className="bg-white w-full h-18 mt-4 p-4 border rounded-md resize-none" placeholder="Texto adicional após a mensagem principal"></textarea>
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="listaRecursos">Lista de Itens (Separe por vírgulas)</label>
                        <textarea id="listaRecursos" className="bg-white w-full h-25 mt-4 p-4 border rounded-md resize-none" placeholder="Item 1, Item 2, Item 3..."></textarea>
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="listaRecursos">Tabela de Dados (Formato: Label: Valor, Label2: Valor2)</label>
                        <textarea id="listaRecursos" className="bg-white w-full h-25 mt-4 p-4 border rounded-md resize-none" placeholder="Nome: João Silva, Data: 25/01/2025"></textarea>
                      </div>
                      <div className="bg-[#FDF2F8] p-4 rounded-2xl border border-[#C7D2FE] flex flex-col items-start w-full">
                        <div className="flex flex-row gap-2">
                          <input type="checkbox" name="exibirBotao" id="exibirBotao" checked={botaoLink} onChange={(e) => setBotaoLink(e.target.checked)} />
                          <label htmlFor="exibirBotao">Exibir Botão de Ação</label>
                        </div>
                        {botaoLink && (
                          <div className="flex flex-col md:flex-row gap-6 w-full">
                            <div className="flex-1">
                              <Input defaultValue="Começar Agora" className="bg-white" id="nomeSistema" type="text" label="Texto do Botão *" altura="" largura="w-full" placeholder="Ex: Começar Agora" />
                            </div>
                            <div className="flex-1">
                              <Input className="bg-white" id="nomeDestinatario" type="text" label="URL do Botão *" altura="" largura="w-full" placeholder="https://exemplo.com" />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="bg-[#FDF2F8] p-4 rounded-2xl border border-[#C7D2FE] flex flex-col items-start w-full">
                        <div className="flex flex-row gap-2">
                          <input type="checkbox" name="exibirBotao2" id="exibirBotao2" checked={botaoLink2} onChange={(e) => setBotaoLink2(e.target.checked)} />
                          <label htmlFor="exibirBotao2">Exibir Botão Secundário</label>
                        </div>
                        {botaoLink2 && (
                          <div className="flex flex-col md:flex-row gap-6 w-full">
                            <div className="flex-1">
                              <Input defaultValue="Começar Agora" className="bg-white" id="nomeSistema" type="text" label="Texto do Botão *" altura="" largura="w-full" placeholder="Ex: Começar Agora" />
                            </div>
                            <div className="flex-1">
                              <Input className="bg-white" id="nomeDestinatario" type="text" label="URL do Botão *" altura="" largura="w-full" placeholder="https://exemplo.com" />
                            </div>
                          </div>
                        )}
                      </div>
                      <label htmlFor="informacaoAdicional">Informações Adicionais</label>
                      <textarea id="informacaoAdicional" className="bg-white w-full h-18 mt-4 p-4 border rounded-md resize-none" placeholder="Informações extras antes do footer"></textarea>
                    </div>
                  </div>

                  <div className="bg-[#FAF5FF] rounded-2xl p-6">
                    <h2 className="font-bold text-black text-[18px]">Customização Visual</h2>
                    <Input className="bg-white" id="logoUrl" type="text" label="URL do Logo" altura="" largura="" placeholder="https://exemplo.com/logo.png" />
                    <div className="flex flex-row items-center justify-between">
                      <Input className="bg-white" id="corHeader" type="color" label="Cor Primária (Header)" altura="h-16" largura="w-[500px]" placeholder="" />
                      <Input className="bg-white" id="corBotao" type="color" label="Cor do Botão" altura="h-16" largura="w-[500px]" placeholder="" />
                      <Input className="bg-white" id="corDestaque" type="color" label="Cor de Destaque" altura="h-16" largura="w-[500px]" placeholder="" />
                    </div>
                  </div>

                  <div className="bg-[#F9FAFB] rounded-2xl p-6">
                    <h2 className="font-bold text-black text-[18px]">Rodapé</h2>
                    <span>Texto do Footer</span>
                    <div className="flex flex-row gap-3 items-center">
                      <input type="checkbox" name="footerLinks" id="footerLinks" checked={footerLinks} onChange={(e) => setFooterLinks(e.target.checked)} />
                      <label htmlFor="footerLinks">Exibir Links no Footer</label>
                    </div>
                    {footerLinks && (
                      <div className="flex flex-row gap-6 items-center justify-between">
                        <Input className="bg-white" id="linkSite" type="text" label="Link do Site" altura="" largura="w-[500px]" placeholder="https://site.com" />
                        <Input className="bg-white" id="linkSuporte" type="text" label="Link do Suporte" altura="" largura="w-[500px]" placeholder="https://suporte.com" />
                        <Input className="bg-white" id="linkPrivacidade" type="text" label="Link Privacidade" altura="" largura="w-[500px]" placeholder="https://privacidade.com" />
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Logs Recentes */}
      {activeTab === 'Logs Recentes' && (
        <div>
          <div className="bg-white rounded-2xl border mt-10 p-4 md:p-10 mx-4 md:mx-17 overflow-x-auto">
            <div className="flex flex-row items-center gap-2">
              <img className="h-[24px] w-[24px]" src="/recents-purple.png" draggable='false' />
              <h1 className="font-bold text-xl md:text-2xl">Logs Recentes</h1>
            </div>
            {loadingStats ? (
              <div className="text-center p-10">Carregando...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Usuário</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                    stats.recentActivity.map((log, index) => (
                      <TableRow key={log._id || `log-${index}`}>
                        <TableCell>{formatDate(log.createdAt)}</TableCell>
                        <TableCell className="flex flex-row items-center justify-items-start">
                          <HttpMethodBadge method={log.method} />
                        </TableCell>
                        <TableCell>{log.path}</TableCell>
                        <TableCell><StatusCodeBadge code={log.statusCode} /></TableCell>
                        <TableCell>{log.apiKeyUser || 'N/A'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">Nenhum log encontrado</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      )}
    </>
  );
}
