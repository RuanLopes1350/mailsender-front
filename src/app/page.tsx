"use client";

import { useState } from "react";
import Tab from "@/components/tab";
import CardInfo from "@/components/card-info";
import Link from "next/link";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGeneralStats, useApiKeys, useDeactivateApiKey, useReactivateApiKey, useRevokeApiKey } from "@/hooks/useData";
import { formatDate, EmailStatusBadge, ApiKeyStatusBadge, HttpMethodBadge, StatusCodeBadge } from "@/components/badges";
import Button from "@/components/button";
import Modal from "@/components/modal";
import Input from "@/components/input";
import { IZodError } from "@/types/interfaces";
import { ZodError } from "zod";
import { apiKeySchema } from "../validations/apiKey";
import { useGenerateApiKey } from "@/hooks/useData"


export default function Home() {
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("Testar Email");
  const [footerLinks, setFooterLinks] = useState(false);

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
  const [respostaAPI, setRespostaAPI] = useState<string | null>(null);
  const [copiadoAPI, setCopiadoAPI] = useState(false);
  const generateApiKey = useGenerateApiKey();

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
      let response = await generateApiKey.mutateAsync({ name, email, pass });
      setRespostaAPI(response.apiKey);
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
      await navigator.clipboard.writeText(respostaAPI || '');
      setCopiadoAPI(true);
      // Reseta após 2 segundos
      setTimeout(() => setCopiadoAPI(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
      alert('Erro ao copiar. Tente selecionar e copiar manualmente.');
    }
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
      <Modal
        titulo="Adicionar Nova Chave de API"
        isOpen={activeModal === 'novaApi'}
        onClose={() => setActiveModal(null)}
      >
        <Input id="nome" placeholder="Nome do Serviço" label="Nome" type="text" altura="" largura="" />
        <Input id="email" placeholder="meu@servico.com" label="Email" type="email" altura="" largura="" />
        <Input id="nome" placeholder="Senha de App/Token" label="Senha/Token" type="password" altura="" largura="" />
        <Button
          texto={isLoadingAPI ? "Gerando..." : "Gerar API Key"}
          cor="bg-[#4F46E5]"
          hover="hover:bg-[#231c9b]"
          largura="w-full"
          altura="h-[42px] sm:h-[48px]"
          margem="mb-3 sm:mb-5 mt-6 sm:mt-8 md:mt-10"
          onClick={() => gerarApiKey(nameAPI, emailAPI, passAPI)}
        />
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
                      <TableHead>Para</TableHead>
                      <TableHead>Assunto</TableHead>
                      <TableHead>Template</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats?.recentEmails && stats.recentEmails.length > 0 ? (
                      stats.recentEmails.map((email, index) => (
                        <TableRow key={email._id || `email-${index}`}>
                          <TableCell>{formatDate(email.createdAt)}</TableCell>
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
                            <img className='cursor-pointer' src="/erase.png" onClick={() => deletarChave(key.nome)} draggable='false' />
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
                <Input id="apiKey" type="text" label="API Key *" altura="" largura="" placeholder="Digite sua API Key" />
                <Input id="destinatario" type="email" label="Para (email) *" altura="" largura="" placeholder="destinatario@example.com" />
                <Input id="assunto" type="text" label="Assunto *" altura="" largura="" placeholder="Assunto do E-mail" />
                <div className="flex flex-col mt-4 mb-4 gap-2">
                  <select className="p-4 rounded-[10px] border">
                    <option disabled defaultValue={''}>Selecione um template</option>
                    <option value="bemvindo">Bem-Vindo</option>
                    <option value="generico">Genérico</option>
                  </select>
                </div>
              </div>

              <div className="bg-[#EEF2FF] rounded-2xl p-6">
                <h2>Campos do Template: Bem-Vindo</h2>
                <span>Todos os campos são opcionais, exceto os marcados com *</span>
                <div className="flex flex-col gap-4 mt-4">
                  <div className="flex flex-col md:flex-row gap-6 w-full">
                    <div className="flex-1">
                      <Input className="" id="nomeSistema" type="text" label="Nome do Sistema" altura="" largura="w-full" placeholder="Ex: Meu Sistema" />
                    </div>
                    <div className="flex-1">
                      <Input className="" id="nomeDestinatario" type="text" label="Nome do Destinatário" altura="" largura="w-full" placeholder="Ex: João Silva" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="mensagemPrincipal">Mensagem Principal</label>
                    <textarea id="mensagemPrincipal" className="w-full h-32 mt-4 p-4 border rounded-md resize-none" placeholder="Mensagem de Boas-Vindas personalizada"></textarea>
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="mensagemSecundaria">Mensagem Secundária</label>
                    <textarea id="mensagemSecundaria" className="w-full h-18 mt-4 p-4 border rounded-md resize-none" placeholder="Texto adicional após a mensagem principal"></textarea>
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="listaRecursos">Lista de Benefícios/Recursos (Separe por vírgulas)</label>
                    <textarea id="listaRecursos" className="w-full h-25 mt-4 p-4 border rounded-md resize-none" placeholder="Recurso 1, Recurso 2, Recurso 3..."></textarea>
                  </div>
                </div>
              </div>

              <div className="bg-[#FAF5FF] rounded-2xl p-6">
                <h2 className="font-bold text-black text-[18px]">Customização Visual</h2>
                <Input id="logoUrl" type="text" label="URL do Logo" altura="" largura="" placeholder="https://exemplo.com/logo.png" />
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
                    <Input id="linkSite" type="text" label="Link do Site" altura="" largura="w-[500px]" placeholder="https://site.com" />
                    <Input id="linkSuporte" type="text" label="Link do Suporte" altura="" largura="w-[500px]" placeholder="https://suporte.com" />
                    <Input id="linkPrivacidade" type="text" label="Link Privacidade" altura="" largura="w-[500px]" placeholder="https://privacidade.com" />
                  </div>
                )}
              </div>
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
