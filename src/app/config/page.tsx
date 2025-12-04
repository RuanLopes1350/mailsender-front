"use client"

import { Settings } from 'lucide-react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { useState, useEffect } from 'react'
import { UserPlus, Users, UserX, UserPen } from 'lucide-react'
import Button from '@/components/button'
import Modal from '@/components/modal'
import Input from '@/components/input'
import { useApproveApiKey, useConfig, useCreateAdminUser, useAllAdmins, useDeleteAdminUser } from '@/hooks/useData'
import { IZodError } from '@/types/interfaces'
import { set, ZodError } from 'zod'
import { adminSchema } from '@/validations/admin'
import { IAdmin } from '@/types/api'
import { DeleteAdminResponse } from '@/types/api'

export default function ConfigPage() {
    let agora = new Date();
    let dataFormatada = agora.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    let horaFormatada = agora.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    let agoraFormatada = `${dataFormatada} ${horaFormatada}`;
    const [activeModal, setActiveModal] = useState<string | null>(null)

    const { data: config, isLoading } = useConfig();
    const { mutate: approve } = useApproveApiKey();
    const [aprovarApi, setAprovarApi] = useState<boolean>(false)
    const [retentativas, setRetentativas] = useState<number>(3)

    // Estados para criação de admin
    const [novoAdminUsername, setNovoAdminUsername] = useState<string>('');
    const [novoAdminPassword, setNovoAdminPassword] = useState<string>('');
    const [novoAdminCarregando, setNovoAdminCarregando] = useState<boolean>(false);
    const [todosAdmin, setTodosAdmin] = useState<IAdmin[]>([]);
    const [errorAdmin, setErrorAdmin] = useState<IZodError[] | null>(null);
    const [respostaAdmin, setRespostaAdmin] = useState<{ message: string } | null>(null);
    const createAdminMutation = useCreateAdminUser();
    const deleteAdminMutation = useDeleteAdminUser();

    const allAdmin = useAllAdmins();

    useEffect(() => {
        if (allAdmin.data) {
            setTodosAdmin(allAdmin.data);
        }
    }, [allAdmin.data]);

    // Sincroniza o estado local com os dados da API
    useEffect(() => {
        if (config?.data) {
            setAprovarApi(config.data.aprovarApiKey);
            setRetentativas(config.data.retentativas);
        }
    }, [config]);

    const definirAprovarApiKey = async () => {
        try {
            approve()
        } catch (error) {
            console.error(error);
        }
    }

    const cadastrarNovoAdmin = async (username: string, password: string) => {
        setErrorAdmin(null);
        setNovoAdminCarregando(true);

        const adminData = {
            login: username,
            senha: password
        }

        try {
            adminSchema.parse(adminData);
            const response = await createAdminMutation.mutateAsync({ username, password });
            setRespostaAdmin(response);
            // Limpa os campos após sucesso
            setNovoAdminUsername('');
            setNovoAdminPassword('');
            // Atualiza a lista de admins após criar um novo
            allAdmin.refetch();
        } catch (error: any) {
            if (error instanceof ZodError) {
                const mensagensErro: IZodError[] = error.issues.map(err => {
                    return {
                        mensagem: err.message
                    };
                });
                setErrorAdmin(mensagensErro);
            } else {
                setErrorAdmin([{ mensagem: error.message || 'Erro ao criar administrador' }]);
            }
        } finally {
            setNovoAdminCarregando(false);
        }
    }

    const [respostaDeletarAdmin, setRespostaDeletarAdmin] = useState<{ [key: string]: DeleteAdminResponse }>({});
    const [adminDeletando, setAdminDeletando] = useState<string | null>(null);
    
    const deletarAdmin = async (id: string) => {
        setAdminDeletando(id);
        try {
            await deleteAdminMutation.mutateAsync(id);
            setRespostaDeletarAdmin(prev => ({ ...prev, [id]: { message: 'Admin deletado com sucesso' } }));
            // Remove o admin da lista após 1.5 segundos
            setTimeout(() => {
                setTodosAdmin(prev => prev.filter(admin => admin._id !== id));
                setRespostaDeletarAdmin(prev => {
                    const newState = { ...prev };
                    delete newState[id];
                    return newState;
                });
            }, 1500);
        } catch (error) {
            setRespostaDeletarAdmin(prev => ({ ...prev, [id]: { message: 'Erro ao deletar admin' } }));
            console.error('Erro ao deletar admin:', error);
        } finally {
            setAdminDeletando(null);
        }
    }

    const listarTodosAdmins = () => {
        console.log('Listando todos os admins:', todosAdmin);
        return setTodosAdmin(todosAdmin);
    }

    const resetarModalAdmin = () => {
        setRespostaAdmin(null);
        setErrorAdmin(null);
        setNovoAdminUsername('');
        setNovoAdminPassword('');
        setActiveModal(null);
    }

    return (
        <>
            <div className="bg-white rounded-2xl border p-4 md:p-10 mx-4 md:mx-17 overflow-x-auto">
                <div className="flex flex-row items-center gap-2">
                    <Settings className="h-6 w-6" />
                    <h1 className="font-bold text-2xl">Configurações</h1>
                </div>

                <Table>
                    <TableBody className='flex flex-col gap-8'>
                        <TableRow className='flex flex-row'>
                            <TableCell className='flex flex-col'>
                                <h2 className='text-[18px]'>
                                    Aprovação de API Keys
                                </h2>
                                <span className='text-[14px]'>
                                    Aprovar automaticamente novas API Keys
                                </span>
                                <span className='text-[14px]'>
                                    Quando ativado, novas solicitações de API Keys serão aprovadas automaticamente sem necessidade de revisão manual.
                                </span>
                            </TableCell>
                            <TableCell className='flex flex-row flex-1 items-center justify-end'>
                                {isLoading ? (
                                    <div className='text-gray-400'>Carregando...</div>
                                ) : aprovarApi ? (
                                    <div className='flex flex-row items-center transition cursor-pointer justify-end pr-1 pl-1 rounded-2xl bg-blue-900 focus:outline-none ring-1 ring-blue-900 h-7 w-16' onClick={definirAprovarApiKey}>
                                        <div className='bg-white w-6 h-6 rounded-2xl'></div>
                                    </div>
                                ) : (
                                    <div className='flex flex-row items-center transition cursor-pointer justify-start pr-1 pl-1 rounded-2xl bg-gray-600 focus:outline-none ring-1 ring-blue-900 h-7 w-16' onClick={definirAprovarApiKey}>
                                        <div className='bg-white w-6 h-6 rounded-2xl'></div>
                                    </div>
                                )}
                            </TableCell>
                        </TableRow>
                        <TableRow className='flex flex-row'>
                            <TableCell className='flex flex-col'>
                                <h2 className='text-[18px]'>
                                    Administradores
                                </h2>
                                <span className='text-[14px]'>
                                    Gerencie os administradores que têm acesso ao sistema.
                                </span>
                            </TableCell>
                            <TableCell className='flex flex-row flex-1 items-center justify-end gap-2'>
                                <Button
                                    icone={<UserPlus />}
                                    cor='bg-green-600'
                                    altura='h-10'
                                    largura='w-35'
                                    texto='Novo Admin'
                                    hover=''
                                    margem=''
                                    onClick={() => setActiveModal('novo')}
                                />
                                <Button
                                    icone={<Users />}
                                    cor='bg-blue-600'
                                    altura='h-10'
                                    largura='w-35'
                                    texto='Listar Admins'
                                    hover=''
                                    margem=''
                                    onClick={() => {setActiveModal('listar'); listarTodosAdmins();}}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow className='flex flex-row'>
                            <TableCell className='flex flex-col'>
                                <h2 className='text-[18px]'>
                                    Configurações de Email
                                </h2>
                                <span className='text-[14px]'>
                                    Quantidade de Retentativas em Caso de Falha
                                </span>
                                <span className='text-[14px]'>
                                    Define quantas vezes o sistema tentará reenviar um email em caso de falha.
                                </span>
                            </TableCell>
                            <TableCell className='flex flex-row flex-1 items-center justify-end'>
                                <div className="flex flex-col gap-3.5">
                                    <label className="text-[#3B82F6] font-medium text-[15.3px]" htmlFor="retentativas">
                                        Retentativas: {retentativas}
                                    </label>
                                    <div className="relative p-4 rounded-[10px] border border-[#3B82F6]/20 shadow-lg">
                                        <div className="flex justify-between text-white text-base font-semibold pl-[5px] pr-[5px] absolute inset-x-4 top-2 pointer-events-none">
                                            {[1, 2, 3, 4, 5].map(num => (
                                                <span key={num} className="text-[#93C5FD] drop-shadow-sm">{num}</span>
                                            ))}
                                        </div>
                                        <input
                                            id="retentativas"
                                            type="range"
                                            step='1'
                                            min='1'
                                            max='5'
                                            value={retentativas}
                                            onChange={(e) => setRetentativas(Number(e.target.value))}
                                            disabled={isLoading}
                                            className="w-full h-14 rounded-[10px] bg-[#0F172A] border-0 mt-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>

            {/* Modal de Listar Admins */}
            <Modal
                titulo="Lista de Administradores"
                isOpen={activeModal === 'listar'}
                onClose={() => setActiveModal(null)}
            >
                <div className="space-y-3">
                    {todosAdmin.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            Nenhum administrador encontrado.
                        </div>
                    ) : (
                        todosAdmin.map((admin) => {
                            const resposta = respostaDeletarAdmin[admin._id];
                            const isDeletando = adminDeletando === admin._id;
                            
                            return (
                                <div 
                                    key={admin._id} 
                                    className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                                        resposta?.message === 'Admin deletado com sucesso' 
                                            ? 'bg-green-50 border-green-200' 
                                            : resposta?.message === 'Erro ao deletar admin'
                                                ? 'bg-red-50 border-red-200'
                                                : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                                            {(admin.username || 'A').charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-medium text-gray-800">{admin.username || '—'}</span>
                                    </div>
                                    
                                    {resposta ? (
                                        <span className={`text-sm font-medium ${
                                            resposta.message === 'Admin deletado com sucesso' 
                                                ? 'text-green-600' 
                                                : 'text-red-600'
                                        }`}>
                                            {resposta.message === 'Admin deletado com sucesso' ? '✓ ' : '✗ '}
                                            {resposta.message}
                                        </span>
                                    ) : (
                                        <div className="flex gap-2">
                                            <Button 
                                                icone={<UserPen size={16} />} 
                                                cor='bg-orange-500' 
                                                altura='h-9' 
                                                largura='w-28' 
                                                texto='Editar' 
                                                hover='hover:bg-orange-600' 
                                                margem='' 
                                            />
                                            <Button 
                                                icone={<UserX size={16} />} 
                                                cor='bg-red-600' 
                                                altura='h-9' 
                                                largura='w-28' 
                                                texto={isDeletando ? 'Excluindo...' : 'Excluir'} 
                                                hover='hover:bg-red-700' 
                                                margem='' 
                                                onClick={() => !isDeletando && deletarAdmin(admin._id)} 
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </Modal>

            {/* Modal de Novo Admin */}
            <Modal
                titulo="Adicionar Novo Administrador"
                isOpen={activeModal === 'novo'}
                onClose={resetarModalAdmin}
            >
                {respostaAdmin ? (
                    <>
                        <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-[10px] p-4 sm:p-6">
                            <h1 className="text-[#166534] font-bold text-sm sm:text-base">✓ Sucesso!</h1>
                            <p className="text-[#15803D] text-[12px] sm:text-[14px] mt-2">
                                {respostaAdmin.message}
                            </p>
                        </div>
                        <Button
                            texto="Fechar"
                            cor="bg-[#4F46E5]"
                            hover="hover:bg-[#231c9b]"
                            largura="w-full"
                            altura="h-[42px] sm:h-[48px]"
                            margem="mt-6"
                            onClick={resetarModalAdmin}
                        />
                    </>
                ) : (
                    <>
                        {errorAdmin && errorAdmin.length > 0 && (
                            <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded-[10px] p-4 mb-4">
                                <h2 className="text-[#DC2626] font-bold text-sm">⚠ Erros de validação:</h2>
                                <ul className="list-disc list-inside text-[#DC2626] text-xs mt-2">
                                    {errorAdmin.map((erro, index) => (
                                        <li key={index}>{erro.mensagem}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <div className="space-y-3 sm:space-y-4">
                            <Input
                                label='Login'
                                altura='h-[42px] sm:h-[50px]'
                                largura='w-full'
                                id='login'
                                type='text'
                                placeholder='Login do administrador'
                                value={novoAdminUsername}
                                onChange={(e) => setNovoAdminUsername(e.target.value)}
                            />
                            <Input
                                label='Senha'
                                altura='h-[42px] sm:h-[50px]'
                                largura='w-full'
                                id='senha'
                                type='password'
                                placeholder='Senha (mínimo 8 caracteres)'
                                value={novoAdminPassword}
                                onChange={(e) => setNovoAdminPassword(e.target.value)}
                            />
                        </div>
                        <Button
                            margem='mt-6 sm:mt-8'
                            texto={novoAdminCarregando ? 'Cadastrando...' : 'Cadastrar'}
                            cor='bg-green-600'
                            hover='hover:bg-green-900'
                            altura='h-[42px] sm:h-[48px]'
                            largura='w-full'
                            icone={<UserPlus />}
                            onClick={() => cadastrarNovoAdmin(novoAdminUsername, novoAdminPassword)}
                        />
                    </>
                )}
            </Modal>
        </>
    )
}