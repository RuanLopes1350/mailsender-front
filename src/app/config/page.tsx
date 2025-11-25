"use client"

import { Settings } from 'lucide-react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { useState, useEffect } from 'react'
import { UserPlus, Users, UserX, UserPen } from 'lucide-react'
import Button from '@/components/button'
import Modal from '@/components/modal'
import Input from '@/components/input'
import { useApproveApiKey, useConfig, useCreateAdminUser, useAllAdmins } from '@/hooks/useData'
import { IZodError } from '@/types/interfaces'
import { ZodError } from 'zod'
import { adminSchema } from '@/validations/admin'
import { IAdmin } from '@/types/api'

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
                                    onClick={() => setActiveModal('listar')}
                                />
                                {/* <Button icone={<UserX />} cor='bg-red-600' altura='h-10' largura='w-35' texto='Excluir Admin' hover='' margem='' />
                                <Button icone={<UserPen />} cor='bg-orange-500' altura='h-10' largura='w-35' texto='Editar Admin' hover='' margem='' /> */}
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
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Login</TableHead>
                            <TableHead>Criado Em</TableHead>
                            <TableHead>Último Acesso</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>Ruan Lopes</TableCell>
                            <TableCell>Shark1350</TableCell>
                            <TableCell>21/11/2000</TableCell>
                            <TableCell>{agoraFormatada}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Ruan Lopes</TableCell>
                            <TableCell>Shark1350</TableCell>
                            <TableCell>21/11/2000</TableCell>
                            <TableCell>{agoraFormatada}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Ruan Lopes</TableCell>
                            <TableCell>Shark1350</TableCell>
                            <TableCell>21/11/2000</TableCell>
                            <TableCell>{agoraFormatada}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Ruan Lopes</TableCell>
                            <TableCell>Shark1350</TableCell>
                            <TableCell>21/11/2000</TableCell>
                            <TableCell>{agoraFormatada}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
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