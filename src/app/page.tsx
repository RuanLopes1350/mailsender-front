"use client";

import { useState } from "react";
import Tab from "@/components/tab";
import CardInfo from "@/components/card-info";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Home() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <>
      <div className="flex flex-row gap-24 px-16">
        <Tab icon='/dashboard' text='Dashboard' selected={activeTab === 'Dashboard'} onSelect={() => setActiveTab('Dashboard')} />
        <Tab icon='/keys' text='API Keys' selected={activeTab === 'API Keys'} onSelect={() => setActiveTab('API Keys')} />
        <Tab icon='/email' text='Testar Email' selected={activeTab === 'Testar Email'} onSelect={() => setActiveTab('Testar Email')} />
        <Tab icon='/logs' text='Logs Recentes' selected={activeTab === 'Logs Recentes'} onSelect={() => setActiveTab('Logs Recentes')} />
      </div>

      {activeTab === 'Dashboard' && (
        <div>
          <div className="flex flex-row gap-28 pl-18 pt-10 pb-10">
            <CardInfo icon='/emails-dash.png' number={23} description="Total de emails" />
            <CardInfo icon="/success-dash.png" number={21} description="Emails Enviados" />
            <CardInfo icon="/fail-dash.png" number={2} description="Emails Falhados" />
            <CardInfo icon="/logs-dash.png" number={2459} description="Total de Requisições" />
          </div>

          <div className="bg-white rounded-2xl border p-10 mx-17">
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
                <TableRow>
                  <TableCell>24/10/2025, 16:20</TableCell>
                  <TableCell>intel.spec.lopes@gmail.com</TableCell>
                  <TableCell>Recuperação de Senha - IFRO Events</TableCell>
                  <TableCell>generico</TableCell>
                  <TableCell className="bg-[#DCFCE7]">Enviado</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>24/10/2025, 16:18</TableCell>
                  <TableCell>intel.spec.lopes@gmail.com</TableCell>
                  <TableCell>Recuperação de Senha - IFRO Events</TableCell>
                  <TableCell>generico</TableCell>
                  <TableCell className="bg-[#DCFCE7]">Enviado</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>23/10/2025, 22:31</TableCell>
                  <TableCell>intel.spec.lopes@gmail.com</TableCell>
                  <TableCell>Compartilhamento de permissão - IFRO Events</TableCell>
                  <TableCell>generico</TableCell>
                  <TableCell className="bg-[#DCFCE7]">Enviado</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>23/10/2025, 22:31</TableCell>
                  <TableCell>dudutartas@gmail.com</TableCell>
                  <TableCell>Compartilhamento de permissão - IFRO Events</TableCell>
                  <TableCell>generico</TableCell>
                  <TableCell className="bg-[#DCFCE7]">Enviado</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>23/10/2025, 22:29</TableCell>
                  <TableCell>dudutartas@gmail.com</TableCell>
                  <TableCell>Bem-vindo ao IFRO Events!</TableCell>
                  <TableCell>bemvindo</TableCell>
                  <TableCell className="bg-[#fcdcdc]">Falha</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {activeTab === 'API Keys' && (
        <div>
          <div className="bg-white rounded-2xl border mt-10 p-10 mx-17">
            <div className="flex flex-row items-center gap-2">
              <img className="h-[24px] w-[24px]" src="/recents-purple.png" />
              <h1 className="font-bold text-2xl">Gerenciar API Keys</h1>
            </div>
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
                <TableRow>
                  <TableCell>Vitrine</TableCell>
                  <TableCell>$2b$15$LIm0/...</TableCell>
                  <TableCell>09/10/2025, 15:01</TableCell>
                  <TableCell>24/01/2025, 14:32</TableCell>
                  <TableCell className="bg-[#DCFCE7]">Ativa</TableCell>
                  <TableCell>
                    <div className="flex flex-row gap-2">
                      <img className='cursor-pointer' src="/activate.png" />
                      <img className='cursor-pointer' src="/erase.png" />
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>IfroEvents</TableCell>
                  <TableCell>$2b$15$pEBA/...</TableCell>
                  <TableCell>24/10/2025, 16:17</TableCell>
                  <TableCell>24/01/2025, 14:32</TableCell>
                  <TableCell className="bg-[#DCFCE7]">Ativa</TableCell>
                  <TableCell>
                    <div className="flex flex-row gap-2">
                      <img className='cursor-pointer' src="/activate.png"/>
                      <img className='cursor-pointer' src="/erase.png" />
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Teste</TableCell>
                  <TableCell>$2b$15$Xv/0z...</TableCell>
                  <TableCell>26/10/2025, 02:35</TableCell>
                  <TableCell>24/01/2025, 14:32</TableCell>
                  <TableCell className="bg-[#DCFCE7]">Inativa</TableCell>
                  <TableCell>
                    <div className="flex flex-row gap-2">
                      <img className='cursor-pointer' src="/activate.png" />
                      <img className='cursor-pointer' src="/erase.png" />
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {activeTab === 'Logs Recentes' && (
        <div>
          <div className="bg-white rounded-2xl border mt-10 p-10 mx-17">
            <div className="flex flex-row items-center gap-2">
              <img className="h-[24px] w-[24px]" src="/recents-purple.png" />
              <h1 className="font-bold text-2xl">Gerenciar API Keys</h1>
            </div>
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
                <TableRow>
                  <TableCell>25/01/2025, 14:32</TableCell>
                  <TableCell>POST</TableCell>
                  <TableCell>/api/send-email</TableCell>
                  <TableCell>200</TableCell>
                  <TableCell>Vitrine</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>25/01/2025, 09:15</TableCell>
                  <TableCell>POST</TableCell>
                  <TableCell>/api/send-email</TableCell>
                  <TableCell>200</TableCell>
                  <TableCell>IfroEvents</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>24/01/2025, 22:45</TableCell>
                  <TableCell>GET</TableCell>
                  <TableCell>/api/keys</TableCell>
                  <TableCell>200</TableCell>
                  <TableCell>Vitrine</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>24/01/2025, 16:20</TableCell>
                  <TableCell>POST</TableCell>
                  <TableCell>/api/send-email</TableCell>
                  <TableCell>200</TableCell>
                  <TableCell>IfroEvents</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>24/01/2025, 16:18</TableCell>
                  <TableCell>POST</TableCell>
                  <TableCell>/api/send-email</TableCell>
                  <TableCell>500</TableCell>
                  <TableCell>Vitrine</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>23/01/2025, 22:31</TableCell>
                  <TableCell>POST</TableCell>
                  <TableCell>/api/send-email</TableCell>
                  <TableCell>200</TableCell>
                  <TableCell>IfroEvents</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>23/01/2025, 22:31</TableCell>
                  <TableCell>POST</TableCell>
                  <TableCell>/api/send-email</TableCell>
                  <TableCell>200</TableCell>
                  <TableCell>Vitrine</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>23/01/2025, 22:31</TableCell>
                  <TableCell>POST</TableCell>
                  <TableCell>/api/send-email</TableCell>
                  <TableCell>200</TableCell>
                  <TableCell>IfroEvents</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>23/01/2025, 22:29</TableCell>
                  <TableCell>POST</TableCell>
                  <TableCell>/api/send-email</TableCell>
                  <TableCell>200</TableCell>
                  <TableCell>Vitrine</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>23/01/2025, 18:15</TableCell>
                  <TableCell>PATCH</TableCell>
                  <TableCell>/api/keys/toggle</TableCell>
                  <TableCell>200</TableCell>
                  <TableCell>IfroEvents</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>23/01/2025, 15:42</TableCell>
                  <TableCell>DELETE</TableCell>
                  <TableCell>/api/dashboard/stats</TableCell>
                  <TableCell>200</TableCell>
                  <TableCell>Vitrine</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </>
  );
}
