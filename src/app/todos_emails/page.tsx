"use client"

import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableCaption } from "@/components/ui/table"
import Modal from "@/components/modal"
import { useState } from "react"
import { useEmailDetails, useGeneralStats } from "@/hooks/useData"
import { formatDate, EmailStatusBadge } from "@/components/badges";
import { generatePdf } from "@/utils/generatePdf"
import Button from "@/components/button"
import Link from "next/link";
import { EmailDetails } from "@/types/api"
import { useAllEmails } from "@/hooks/useData"
import { useEffect } from "react"
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination"

const ITEMS_PER_PAGE = 10;

export default function TodosEmailsPage() {
    const [activeModal, setActiveModal] = useState<string | null>(null)
    const [emailId, setEmailId] = useState<string>('');
    const [modalEmailAberto, setModalEmailAberto] = useState<boolean>(false);
    const [todosEmails, setTodosEmails] = useState<EmailDetails[]>([]);
    const [emailsPaginaAtual, setEmailsPaginaAtual] = useState<EmailDetails[]>([]);
    const { data: emailDetails, isLoading: loadingEmailDetails } = useEmailDetails(emailId, modalEmailAberto);
    const { data: allEmails } = useAllEmails();
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [totalDocs, setTotalDocs] = useState(0);

    // Atualiza a lista de emails quando todos os emails são carregados
    useEffect(() => {
        if (allEmails) {
            setTodosEmails(allEmails);
            setTotalDocs(allEmails.length);
            setTotalPages(Math.ceil(allEmails.length / ITEMS_PER_PAGE));
        }
    }, [allEmails]);

    // Função para atualizar a página atual
    useEffect(() => {
        if (todosEmails.length > 0) {
            const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
            const endIndex = startIndex + ITEMS_PER_PAGE;
            setEmailsPaginaAtual(todosEmails.slice(startIndex, endIndex));
        }
    }, [currentPage, todosEmails])

    // Atualiza a lista de emails quando todos os emails são carregados
    const handlePageChange = (page: number) => {
        setCurrentPage(page);

        // Pagina localmente os dados já carregados
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        setEmailsPaginaAtual(todosEmails.slice(startIndex, endIndex));
    };

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

    return (
        <>
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
                                            await generatePdf(emailDetails.data, `email-detalhes-${emailDetails._id}.pdf`);
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


            <div className="bg-white rounded-2xl border p-4 md:p-10 mx-4 md:mx-17 overflow-x-auto">
                <div className="mb-2">
                    <Link href="/" className="text-blue-700 hover:underline">&larr; Voltar ao Dashboard</Link>
                </div>
                <div className="flex flex-row items-center gap-2">
                    <img className="h-[24px] w-[24px]" src="/recents-purple.png" draggable='false' />
                    <h1 className="font-bold text-2xl">Emails</h1>
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
                        {emailsPaginaAtual && emailsPaginaAtual.length > 0 ?
                            emailsPaginaAtual.map((email, index) => (
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
                            )
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">Nenhum email encontrado</TableCell>
                                </TableRow>
                            )}
                    </TableBody>
                </Table>
            </div>
            {/* Paginação */}
            {totalPages > 1 && (
                <div className="flex flex-col items-center space-y-4 mt-6 pb-6">
                    {/* Informação de paginação */}
                    <div className="text-sm text-gray-600">
                        Página {currentPage} de {totalPages} ({totalDocs} emails no total)
                    </div>

                    <Pagination>
                        <PaginationContent>
                            {/* Botão Anterior */}
                            <PaginationItem>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (currentPage > 1) handlePageChange(totalPages - totalPages + 1);
                                    }}
                                    disabled={currentPage === 1}
                                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${currentPage === 1
                                        ? 'pointer-events-none opacity-50 cursor-not-allowed'
                                        : 'cursor-pointer'
                                        } bg-white border border-gray-300 text-gray-700 hover:bg-gray-50`}
                                >
                                    Primeira
                                </button>
                            </PaginationItem>
                            <PaginationItem>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (currentPage > 1) handlePageChange(currentPage - 1);
                                    }}
                                    disabled={currentPage === 1}
                                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${currentPage === 1
                                        ? 'pointer-events-none opacity-50 cursor-not-allowed'
                                        : 'cursor-pointer'
                                        } bg-white border border-gray-300 text-gray-700 hover:bg-gray-50`}
                                >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Anterior
                                </button>
                            </PaginationItem>

                            {/* Números das páginas */}
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = index + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = index + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + index;
                                } else {
                                    pageNum = currentPage - 2 + index;
                                }

                                return (
                                    <PaginationItem key={pageNum}>
                                        <button
                                            type="button"
                                            onClick={() => handlePageChange(pageNum)}
                                            aria-current={currentPage === pageNum ? 'page' : undefined}
                                            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${currentPage === pageNum
                                                ? 'bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-600'
                                                : 'cursor-pointer bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    </PaginationItem>
                                );
                            })}

                            {/* Botão Próximo */}
                            <PaginationItem>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (currentPage < totalPages) handlePageChange(currentPage + 1);
                                    }}
                                    disabled={currentPage === totalPages}
                                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${currentPage === totalPages
                                        ? 'pointer-events-none opacity-50 cursor-not-allowed'
                                        : 'cursor-pointer'
                                        } bg-white border border-gray-300 text-gray-700 hover:bg-gray-50`}
                                >
                                    Próximo
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </PaginationItem>
                            <PaginationItem>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (currentPage < totalPages) handlePageChange(totalPages);
                                    }}
                                    disabled={currentPage === totalPages}
                                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${currentPage === totalPages
                                        ? 'pointer-events-none opacity-50 cursor-not-allowed'
                                        : 'cursor-pointer'
                                        } bg-white border border-gray-300 text-gray-700 hover:bg-gray-50`}
                                >
                                    Última
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </>
    )
}