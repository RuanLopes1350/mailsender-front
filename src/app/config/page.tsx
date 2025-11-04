"use client"

import { Settings } from 'lucide-react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { useState } from 'react'
import { UserPlus, Users, UserX, UserPen } from 'lucide-react'
import Button from '@/components/button'
import Modal from '@/components/modal'
import Input from '@/components/input'

export default function ConfigPage() {
    const [aprovarApi, setAprovarApi] = useState<boolean>(true)
    const [activeModal, setActiveModal] = useState<string | null>(null)

    const handleAprovarApiClick = async (estado: boolean) => {
        if (estado === true) {
            setAprovarApi(false)
            return
        } else {
            setAprovarApi(true)
            return
        }
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
                                {aprovarApi ? (
                                    <div className='flex flex-row items-center transition cursor-pointer justify-end pr-1 pl-1 rounded-2xl bg-blue-900 focus:outline-none ring-1 ring-blue-900 h-7 w-16' onClick={() => handleAprovarApiClick(aprovarApi)}>
                                        <div className='bg-white w-6 h-6 rounded-2xl'></div>
                                    </div>
                                ) : (
                                    <div className='flex flex-row items-center transition cursor-pointer justify-start pr-1 pl-1 rounded-2xl bg-gray-600 focus:outline-none ring-1 ring-blue-900 h-7 w-16' onClick={() => handleAprovarApiClick(aprovarApi)}>
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
                <div></div>
            </Modal>

            {/* Modal de Novo Admin */}
            <Modal
                titulo="Adicionar Novo Administrador"
                isOpen={activeModal === 'novo'}
                onClose={() => setActiveModal(null)}
            >
                <div></div>
            </Modal>
        </>
    )
}