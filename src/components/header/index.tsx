"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut, Settings, LayoutDashboard } from 'lucide-react'
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
    const pathname = usePathname();
    const ignore = ['/login', '/cadastro'];

    // Se a rota atual está na lista de ignorados, não renderiza nada
    if (ignore.includes(pathname)) {
        return null;
    }

    const { logout } = useAuth()
    const handleLogOut = async () => {
        console.log('Saindo...')
        window.location.href = '/login'
        return logout()
    }

    return (
        <div className="min-h-[100px] md:min-h-[136px] bg-linear-to-r from-[#4F46E5] to-[#9333EA] flex flex-col items-center justify-center mt-4 md:mt-6 mb-4 md:mb-6 px-4 max-w-[1850px] mx-4 md:mx-auto rounded-2xl shadow-2xl py-6">
            <div className="flex flex-row items-center gap-2">
                <img src="/logo-white.png" className="w-8 h-8 md:w-10 md:h-10" alt="Logo" />
                <h1 className="text-xl md:text-2xl font-bold text-white">Mail Sender</h1>
            </div>
            <p className="text-[#E0E7FF] text-xs md:text-sm pt-2">Painel Administrativo</p>

            <div className="flex flex-row items-center justify-center gap-5 mt-2">
                {!pathname?.includes('/config') ? (
                    <Link className="flex flex-row items-center" href='/config'>
                        <Settings className="text-white h-[18px] w-[18px]" />
                        <span className="text-white text-[14px]">Configurações</span>
                    </Link>
                ) : (
                    <Link className="flex flex-row items-center" href='/'>
                        <LayoutDashboard className="text-white h-[18px] w-[18px]" />
                        <span className="text-white text-[14px]">Dashboard</span>
                    </Link>
                )}
                <div className="flex flex-row items-center cursor-pointer" onClick={handleLogOut}>
                    <LogOut className="text-white h-[18px] w-[18px]" />
                    <span className="text-white text-[14px]">Sair</span>
                </div>
            </div>
        </div>

    )
}