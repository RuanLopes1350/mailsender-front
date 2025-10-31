"use client";

import AuthPanel from "@/components/auth-panel";
import Input from "@/components/input";

export default function LoginPage() {
    return (
        <>
            <div>
                <div className="flex flex-col items-center gap-2">
                    <img src="/logo-purple.png" />
                    <h1 className="text-2xl font-bold text-[#111827]">Mail Sender</h1>
                    <p className="text-[#4B5563] text-[14px] pt-2">Painel Administrativo</p>
                </div>
            </div>

            <div className="flex items-center justify-center">
                <AuthPanel titulo="Login de Administrador" rodape="Precisa de uma API Key?" rodapeLink="/cadastro" rodapeLinkTexto="Registre seu serviço" altura="h-[408px]" largura="w-[448px]">
                    <Input id="email" label="Email" type="email" placeholder="admin@example.com" altura="h-[50px]" largura="w-[384px]" />
                    <Input id="senha" label="Senha" type="password" placeholder="********" altura="h-[50px]" largura="w-[384px]" />
                </AuthPanel>
            </div>
        </>
    )
}