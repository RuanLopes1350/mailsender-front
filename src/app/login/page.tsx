"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthPanel from "@/components/auth-panel";
import Button from "@/components/button";
import Input from "@/components/input";
import { useAuth } from "@/contexts/AuthContext";
import { loginSchema } from "../../validations/login";
import { ZodError } from "zod"
import { IZodError } from "@/types/interfaces";

export default function LoginPage() {

    const router = useRouter();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<IZodError[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function handleLogin() {
        // Limpa erros anteriores
        setError(null);

        const loginData = { login: email, senha: password };

        try {
            setIsLoading(true);

            loginSchema.parse(loginData);

            // Faz o login usando o contexto
            await login(email, password);

            // Se chegou aqui, o login foi bem-sucedido
            console.log("Login realizado com sucesso!");

            // Redireciona para a página principal
            router.push("/painel");
        } catch (error: any) {
            if (error instanceof ZodError) {
                const mensagensErro: IZodError[] = error.issues.map(err => {
                    console.log(err.message)
                    return {
                        mensagem: err.message
                    };
                });
                setError(mensagensErro);
            } else {
                setError([{ mensagem: error.message || 'Erro ao gerar API Key' }]);
            }
        } finally {
            setIsLoading(false);
        }
    }

    // Função para lidar com Enter
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isLoading) {
            handleLogin();
        }
    }

    return (
        <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center p-2 sm:p-4 md:p-8 gap-3 sm:gap-4 md:gap-6 py-4 sm:py-6 md:py-8 relative">
            <Link 
                href="/tutorial"
                className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base"
            >
                Tutorial
            </Link>
            <div className="w-full max-w-md px-2 sm:px-0">
                <div className="flex flex-col items-center gap-1 sm:gap-2">
                    <img src="/logo-purple.png" className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain" alt="Logo Mail Sender" draggable='false' />
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#111827]">Mail Sender</h1>
                    <p className="text-[#4B5563] text-[11px] sm:text-[12px] md:text-[14px] pt-1 sm:pt-2">Painel Administrativo</p>
                </div>
            </div>

            <div className="w-full max-w-md flex items-center justify-center px-2 sm:px-4">
                <AuthPanel titulo="Login de Administrador" rodape="Precisa de uma API Key?" rodapeLink="/cadastro" rodapeLinkTexto="Registre seu serviço" altura="h-auto" largura="w-full">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded-[10px] mt-2 sm:mt-4" role="alert">
                            <p className="text-xs sm:text-sm">{error[0].mensagem}</p>
                        </div>
                    )}

                    <div className="space-y-3 sm:space-y-4">
                        <Input
                            id="Login"
                            label="Login"
                            type="text"
                            placeholder="admin@example.com"
                            altura="h-[42px] sm:h-[50px]"
                            largura="w-full"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />

                        <Input
                            id="senha"
                            label="Senha"
                            type="password"
                            placeholder="********"
                            altura="h-[42px] sm:h-[50px]"
                            largura="w-full"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    </div>

                    <Button
                        texto={isLoading ? "Entrando..." : "Entrar"}
                        cor="bg-[#4F46E5]"
                        hover="hover:bg-[#231c9b]"
                        largura="w-full"
                        altura="h-[42px] sm:h-[48px]"
                        margem="mb-3 sm:mb-5 mt-6 sm:mt-8 md:mt-10"
                        onClick={handleLogin}
                    />
                </AuthPanel>
            </div>
            
            <div className="w-full max-w-md flex items-center justify-center px-2 sm:px-4 mt-4">
                <Link 
                    href="/meus_emails"
                    className="text-[#6366F1] hover:text-[#4F46E5] text-xs sm:text-sm font-medium transition-colors duration-200 flex items-center gap-2 group"
                >
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Consultar meus emails enviados
                </Link>
            </div>
        </div>
    )
}