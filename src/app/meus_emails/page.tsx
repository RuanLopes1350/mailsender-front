"use client";

import AuthPanel from "@/components/auth-panel";
import Modal from "@/components/modal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";

export default function MeusEmailsPage() {
    const [modalAberto, setModalAberto] = useState<boolean>(true);
    const [emailSelecionado, setEmailSelecionado] = useState<any>(null);

    return (

        <>
            {/* modal zone */}
            <Modal titulo="" isOpen={modalAberto} onClose={() => setModalAberto(false)}>
                <div>
                    
                </div>
            </Modal>

            {/* tela */}
            <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center p-2 sm:p-4 md:p-8 gap-3 sm:gap-4 md:gap-6 py-4 sm:py-6 md:py-8">
                <div className="w-full max-w-md px-2 sm:px-0">
                    <div className="flex flex-col items-center gap-1 sm:gap-2">
                        <img src="/logo-purple.png" className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain" alt="Logo Mail Sender" draggable='false' />
                        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#111827]">Mail Sender</h1>
                        <p className="text-[#4B5563] text-[11px] sm:text-[12px] md:text-[14px] pt-1 sm:pt-2">Painel Administrativo</p>
                    </div>
                </div>

                <AuthPanel titulo="Meus Emails" altura="h-[600px]" largura="w-[1400px]" rodape="Rodapé do Painel">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Data</TableHead>
                                <TableHead>Destinatário</TableHead>
                                <TableHead>Assunto</TableHead>
                                <TableHead>Template</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow className="cursor-pointer" onClick={() => setModalAberto(true)}>
                                <TableCell>01/01/2023</TableCell>
                                <TableCell>destinatario@example.com</TableCell>
                                <TableCell>Assunto do Email</TableCell>
                                <TableCell>Template 1</TableCell>
                                <TableCell>Enviado</TableCell>
                            </TableRow>
                            <TableRow className="cursor-pointer" onClick={() => { setModalAberto(true), setEmailSelecionado(null) }}>
                                <TableCell>01/01/2023</TableCell>
                                <TableCell>destinatario@example.com</TableCell>
                                <TableCell>Assunto do Email</TableCell>
                                <TableCell>Template 1</TableCell>
                                <TableCell>Enviado</TableCell>
                            </TableRow>
                            <TableRow className="cursor-pointer" onClick={() => { setModalAberto(true), setEmailSelecionado(null) }}>
                                <TableCell>01/01/2023</TableCell>
                                <TableCell>destinatario@example.com</TableCell>
                                <TableCell>Assunto do Email</TableCell>
                                <TableCell>Template 1</TableCell>
                                <TableCell>Enviado</TableCell>
                            </TableRow>
                            <TableRow className="cursor-pointer" onClick={() => { setModalAberto(true), setEmailSelecionado(null) }}>
                                <TableCell>01/01/2023</TableCell>
                                <TableCell>destinatario@example.com</TableCell>
                                <TableCell>Assunto do Email</TableCell>
                                <TableCell>Template 1</TableCell>
                                <TableCell>Enviado</TableCell>
                            </TableRow>
                            <TableRow className="cursor-pointer" onClick={() => { setModalAberto(true), setEmailSelecionado(null) }}>
                                <TableCell>01/01/2023</TableCell>
                                <TableCell>destinatario@example.com</TableCell>
                                <TableCell>Assunto do Email</TableCell>
                                <TableCell>Template 1</TableCell>
                                <TableCell>Enviado</TableCell>
                            </TableRow>
                            <TableRow className="cursor-pointer" onClick={() => { setModalAberto(true), setEmailSelecionado(null) }}>
                                <TableCell>01/01/2023</TableCell>
                                <TableCell>destinatario@example.com</TableCell>
                                <TableCell>Assunto do Email</TableCell>
                                <TableCell>Template 1</TableCell>
                                <TableCell>Enviado</TableCell>
                            </TableRow>
                            <TableRow className="cursor-pointer" onClick={() => { setModalAberto(true), setEmailSelecionado(null) }}>
                                <TableCell>01/01/2023</TableCell>
                                <TableCell>destinatario@example.com</TableCell>
                                <TableCell>Assunto do Email</TableCell>
                                <TableCell>Template 1</TableCell>
                                <TableCell>Enviado</TableCell>
                            </TableRow>
                            <TableRow className="cursor-pointer" onClick={() => { setModalAberto(true), setEmailSelecionado(null) }}>
                                <TableCell>01/01/2023</TableCell>
                                <TableCell>destinatario@example.com</TableCell>
                                <TableCell>Assunto do Email</TableCell>
                                <TableCell>Template 1</TableCell>
                                <TableCell>Enviado</TableCell>
                            </TableRow>
                            <TableRow className="cursor-pointer" onClick={() => { setModalAberto(true), setEmailSelecionado(null) }}>
                                <TableCell>01/01/2023</TableCell>
                                <TableCell>destinatario@example.com</TableCell>
                                <TableCell>Assunto do Email</TableCell>
                                <TableCell>Template 1</TableCell>
                                <TableCell>Enviado</TableCell>
                            </TableRow>
                            <TableRow className="cursor-pointer" onClick={() => { setModalAberto(true), setEmailSelecionado(null) }}>
                                <TableCell>01/01/2023</TableCell>
                                <TableCell>destinatario@example.com</TableCell>
                                <TableCell>Assunto do Email</TableCell>
                                <TableCell>Template 1</TableCell>
                                <TableCell>Enviado</TableCell>
                            </TableRow>
                            <TableRow className="cursor-pointer" onClick={() => { setModalAberto(true), setEmailSelecionado(null) }}>
                                <TableCell>01/01/2023</TableCell>
                                <TableCell>destinatario@example.com</TableCell>
                                <TableCell>Assunto do Email</TableCell>
                                <TableCell>Template 1</TableCell>
                                <TableCell>Enviado</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </AuthPanel>
            </div>
        </>
    )
}