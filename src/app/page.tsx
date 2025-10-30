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
    </>
  );
}
