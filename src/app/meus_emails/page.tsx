"use client";

import Modal from "@/components/modal";
import Button from "@/components/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useState, useEffect } from "react";
import { useMyEmails, useEmailDetailsWithApiKey } from "@/hooks/useData";
import { EmailDetails } from "@/types/api";
import { generatePdf } from "@/utils/generatePdf";
import Link from "next/link";
import { EmailStatusBadge } from "@/components/badges";

const ITEMS_PER_PAGE = 10;

interface FilterParams {
    status?: string;
    to?: string;
    sentAfter?: string;
    sentBefore?: string;
}

export default function MeusEmailsPage() {
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [emailId, setEmailId] = useState<string>('');
    const [modalEmailAberto, setModalEmailAberto] = useState<boolean>(false);
    const [meusEmails, setMeusEmails] = useState<EmailDetails[]>([]);
    const [emailsPaginaAtual, setEmailsPaginaAtual] = useState<EmailDetails[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalDocs, setTotalDocs] = useState(0);
    const [filters, setFilters] = useState<FilterParams>({});
    const [isFiltering, setIsFiltering] = useState(false);
    const [apiKey, setApiKey] = useState<string>('');
    const [apiKeyInput, setApiKeyInput] = useState<string>('');
    const [hasSearched, setHasSearched] = useState(false);

    const { data: myEmails, isLoading, error } = useMyEmails(apiKey, hasSearched);
    const { data: emailDetails, isLoading: loadingEmailDetails } = useEmailDetailsWithApiKey(emailId, apiKey, modalEmailAberto);

    // Atualiza a lista de emails quando os emails são carregados
    useEffect(() => {
        if (myEmails) {
            setMeusEmails(myEmails);
            setTotalDocs(myEmails.length);
            setTotalPages(Math.ceil(myEmails.length / ITEMS_PER_PAGE));
        }
    }, [myEmails]);

    // Função para atualizar a página atual
    useEffect(() => {
        if (meusEmails.length > 0) {
            const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
            const endIndex = startIndex + ITEMS_PER_PAGE;
            setEmailsPaginaAtual(meusEmails.slice(startIndex, endIndex));
        }
    }, [currentPage, meusEmails]);

    const handleSearch = () => {
        if (!apiKeyInput.trim()) {
            alert('Por favor, informe sua API Key');
            return;
        }
        setApiKey(apiKeyInput);
        setHasSearched(true);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        setEmailsPaginaAtual(meusEmails.slice(startIndex, endIndex));
    };

    const abrirModalDetalhes = (id: string) => {
        setEmailId(id);
        setModalEmailAberto(true);
        setActiveModal('detailsEmailsModal');
    };

    const limparApiKey = () => {
        setApiKey('');
        setApiKeyInput('');
        setHasSearched(false);
        setMeusEmails([]);
        setEmailsPaginaAtual([]);
        setCurrentPage(1);
        setTotalDocs(0);
        setTotalPages(0);
        setFilters({});
        setIsFiltering(false);
    }

    const fecharModalDetalhes = () => {
        setModalEmailAberto(false);
        setEmailId('');
        setActiveModal(null);
    };

    const aplicarFiltros = () => {
        if (!myEmails) return;

        setCurrentPage(1);
        setIsFiltering(true);

        let emailsFiltrados = myEmails.filter(email => {
            if (filters.status && email.status !== filters.status) return false;
            if (filters.to && !email.to.toLowerCase().includes(filters.to.toLowerCase())) return false;
            if (filters.sentAfter && email.sentAt) {
                const dataSentAt = new Date(email.sentAt).getTime();
                const dataSentAfter = new Date(filters.sentAfter).getTime();
                if (dataSentAt < dataSentAfter) return false;
            }
            if (filters.sentBefore && email.sentAt) {
                const dataSentAt = new Date(email.sentAt).getTime();
                const dataSentBefore = new Date(filters.sentBefore).getTime();
                if (dataSentAt > dataSentBefore) return false;
            }
            return true;
        });

        setMeusEmails(emailsFiltrados);
        setTotalDocs(emailsFiltrados.length);
        setTotalPages(Math.ceil(emailsFiltrados.length / ITEMS_PER_PAGE));
    };

    const limparFiltros = () => {
        setFilters({});
        setCurrentPage(1);
        setIsFiltering(false);
        if (myEmails) {
            setMeusEmails(myEmails);
            setTotalDocs(myEmails.length);
            setTotalPages(Math.ceil(myEmails.length / ITEMS_PER_PAGE));
        }
    };

    return (
        <>
            <Modal titulo="Detalhes do Email" onClose={fecharModalDetalhes} isOpen={activeModal === 'detailsEmailsModal'}>
                {loadingEmailDetails ? (
                    <div className="text-center p-10">Carregando detalhes...</div>
                ) : emailDetails ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-semibold text-gray-600">Destinatário:</p>
                                <p className="text-base">{emailDetails.to}</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-600">Remetente:</p>
                                <p className="text-base">{emailDetails.sender}</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-600">Assunto:</p>
                                <p className="text-base">{emailDetails.subject}</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-600">Template:</p>
                                <p className="text-base">{emailDetails.template}</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-600">Status:</p>
                                <EmailStatusBadge status={emailDetails.status} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-600">Data de Envio:</p>
                                <p className="text-base">
                                    {emailDetails.sentAt ? new Date(emailDetails.sentAt).toLocaleString('pt-BR') : 'N/A'}
                                </p>
                            </div>
                            {emailDetails.error && (
                                <div className="col-span-2">
                                    <p className="text-sm font-semibold text-gray-600">Mensagem de Erro:</p>
                                    <p className="text-base text-red-600">{emailDetails.error}</p>
                                </div>
                            )}
                        </div>
                        {emailDetails.data && (
                            <div className="flex flex-col">
                                <Button
                                    onClick={async () => {
                                        try {
                                            await generatePdf(emailDetails.data, `email-${emailDetails._id}.pdf`);
                                        } catch (error) {
                                            console.error('Erro ao gerar PDF:', error);
                                            alert('Erro ao gerar PDF');
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

            <div className="bg-white rounded-2xl border p-4 mt-20 md:p-10 mx-4 md:mx-17 overflow-x-auto">
                <div>
                    <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
                        &larr; Retornar
                    </Link>
                </div>
                <div className="flex flex-row items-center gap-2">
                    <img className="h-6 w-6" src="/recents-purple.png" draggable='false' />
                    <h1 className="font-bold text-2xl">Meus Emails</h1>
                </div>

                {/* Seção de Busca por API Key */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h2 className="font-semibold text-lg mb-4">🔑 Buscar Meus Emails</h2>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Digite sua API Key"
                            value={apiKeyInput}
                            onChange={(e) => setApiKeyInput(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleSearch}
                            disabled={isLoading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                        >
                            {isLoading ? 'Buscando...' : 'Buscar'}
                        </button>
                    </div>
                    {error && (
                        <div className="mt-2 text-red-600 text-sm">
                            ❌ Erro ao buscar emails. Verifique sua API Key.
                        </div>
                    )}
                </div>

                {hasSearched && !isLoading && (
                    <>
                        {/* Seção de Filtros */}
                        <div className="mb-2">
                            <Button cor="bg-[#4f39f6]" altura="h-[42px] sm:h-[48px]" largura="sm:w-auto w-full" texto="Limpar" onClick={() => { limparApiKey() }} />
                        </div>
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <h2 className="font-semibold text-lg mb-4">Filtros</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        value={filters.status || ''}
                                        onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">Todos</option>
                                        <option value="sent">Enviado</option>
                                        <option value="pending">Pendente</option>
                                        <option value="failed">Falhou</option>
                                    </select>
                                </div>

                                {/* Destinatário */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Destinatário</label>
                                    <input
                                        type="text"
                                        placeholder="Filtrar por destinatário"
                                        value={filters.to || ''}
                                        onChange={(e) => setFilters({ ...filters, to: e.target.value || undefined })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                {/* Data Antes */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Enviado Antes de</label>
                                    <input
                                        type="date"
                                        value={filters.sentBefore || ''}
                                        onChange={(e) => setFilters({ ...filters, sentBefore: e.target.value || undefined })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                {/* Data Depois */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Enviado Depois de</label>
                                    <input
                                        type="date"
                                        value={filters.sentAfter || ''}
                                        onChange={(e) => setFilters({ ...filters, sentAfter: e.target.value || undefined })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            {/* Botões de Filtro */}
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={aplicarFiltros}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
                                >
                                    Aplicar Filtros
                                </button>
                                {isFiltering && (
                                    <button
                                        onClick={limparFiltros}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 font-medium"
                                    >
                                        Limpar Filtros
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Tabela */}
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
                                {emailsPaginaAtual.length > 0 ? (
                                    emailsPaginaAtual.map((email) => (
                                        <TableRow key={email._id} className="cursor-pointer hover:bg-gray-50" onClick={() => abrirModalDetalhes(email._id)}>
                                            <TableCell>{email.sentAt ? new Date(email.sentAt).toLocaleString('pt-BR') : 'N/A'}</TableCell>
                                            <TableCell>{email.to}</TableCell>
                                            <TableCell>{email.subject}</TableCell>
                                            <TableCell>{email.template}</TableCell>
                                            <TableCell>
                                                <EmailStatusBadge status={email.status} />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                                            Nenhum email encontrado
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </>
                )}

                {!hasSearched && (
                    <div className="text-center text-gray-500 py-8">
                        Digite sua API Key acima para visualizar seus emails
                    </div>
                )}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
                <div className="flex flex-col items-center space-y-4 mt-6 pb-6">
                    <div className="text-sm text-gray-600">
                        Página {currentPage} de {totalPages} ({totalDocs} emails no total)
                    </div>

                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (currentPage > 1) handlePageChange(currentPage - 1);
                                    }}
                                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                />
                            </PaginationItem>

                            {/* Primeira página */}
                            {currentPage > 3 && (
                                <>
                                    <PaginationItem>
                                        <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(1); }}>
                                            1
                                        </PaginationLink>
                                    </PaginationItem>
                                    {currentPage > 4 && (
                                        <PaginationItem>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    )}
                                </>
                            )}

                            {/* Páginas ao redor da atual */}
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(page => {
                                    return page === currentPage ||
                                        page === currentPage - 1 ||
                                        page === currentPage + 1 ||
                                        page === currentPage - 2 ||
                                        page === currentPage + 2;
                                })
                                .map(page => (
                                    <PaginationItem key={page}>
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => { e.preventDefault(); handlePageChange(page); }}
                                            isActive={currentPage === page}
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}

                            {/* Última página */}
                            {currentPage < totalPages - 2 && (
                                <>
                                    {currentPage < totalPages - 3 && (
                                        <PaginationItem>
                                            <PaginationEllipsis />
                                        </PaginationItem>
                                    )}
                                    <PaginationItem>
                                        <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(totalPages); }}>
                                            {totalPages}
                                        </PaginationLink>
                                    </PaginationItem>
                                </>
                            )}

                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (currentPage < totalPages) handlePageChange(currentPage + 1);
                                    }}
                                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </>
    );
}