"use client";

import { useState } from "react";
import Tab from "@/components/tab";
import CardInfo from "@/components/card-info";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGeneralStats, useApiKeys, useDeactivateApiKey, useReactivateApiKey, useRevokeApiKey } from "@/hooks/useData";
import { formatDate, EmailStatusBadge, ApiKeyStatusBadge, HttpMethodBadge, StatusCodeBadge } from "@/components/badges";
import apiClient from "@/services/apiClient";

export default function Home() {
  const [activeTab, setActiveTab] = useState("Dashboard");

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


  // Debug
  console.log('Stats:', stats);
  console.log('Loading Stats:', loadingStats);
  console.log('Error Stats:', errorStats);
  console.log('API Keys:', apiKeys);
  console.log('Loading Keys:', loadingKeys);
  console.log('Error Keys:', errorKeys);

  return (
    <>
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
                  <img className="h-[24px] w-[24px]" src="/recents-purple.png" />
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
              <img className="h-[24px] w-[24px]" src="/recents-purple.png" />
              <h1 className="font-bold text-xl md:text-2xl">Gerenciar API Keys</h1>
            </div>
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
                            <img className='cursor-pointer' src={key.ativa ? "/deactivate.png" : "/activate.png"} onClick={() => key.ativa ? inativarChave(key.nome) : reativarChave(key.nome)} />
                            <img className='cursor-pointer' src="/erase.png" onClick={() => deletarChave(key.nome)} />
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

      {/* Logs Recentes */}
      {activeTab === 'Logs Recentes' && (
        <div>
          <div className="bg-white rounded-2xl border mt-10 p-4 md:p-10 mx-4 md:mx-17 overflow-x-auto">
            <div className="flex flex-row items-center gap-2">
              <img className="h-[24px] w-[24px]" src="/recents-purple.png" />
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
