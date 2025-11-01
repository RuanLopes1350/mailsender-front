"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthPanel from "@/components/auth-panel";
import Button from "@/components/button";
import Input from "@/components/input";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleLogin() {
        // Limpa erros anteriores
        setError("");

        // Validações básicas
        if (!email || !password) {
            setError("Por favor, preencha todos os campos");
            return;
        }

        // if (!email.includes("@")) {
        //     setError("Por favor, insira um email válido");
        //     return;
        // }

        try {
            setIsLoading(true);
            
            // Faz o login usando o contexto
            await login(email, password);
            
            // Se chegou aqui, o login foi bem-sucedido
            console.log("Login realizado com sucesso!");
            
            // Redireciona para a página principal
            router.push("/");
        } catch (err: any) {
            console.error("Erro ao fazer login:", err);
            setError(err.message || "Erro ao fazer login. Verifique suas credenciais.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 gap-6 md:gap-8">
            <div className="w-full max-w-md">
                <div className="flex flex-col items-center gap-2">
                    <img src="/logo-purple.png" className="w-20 h-20 sm:w-24 sm:h-24 md:w-auto md:h-auto object-contain" alt="Logo Mail Sender" />
                    <h1 className="text-xl sm:text-2xl font-bold text-[#111827]">Mail Sender</h1>
                    <p className="text-[#4B5563] text-[12px] sm:text-[14px] pt-2">Painel Administrativo</p>
                </div>
            </div>

            <div className="w-full max-w-md flex items-center justify-center px-4">
                <AuthPanel titulo="Login de Administrador" rodape="Precisa de uma API Key?" rodapeLink="/cadastro" rodapeLinkTexto="Registre seu serviço" altura="h-auto min-h-[408px]" largura="w-full">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-[10px] mt-4" role="alert">
                            <p className="text-sm">{error}</p>
                        </div>
                    )}
                    
                    <Input 
                        id="Login" 
                        label="Login" 
                        type="text" 
                        placeholder="admin@example.com" 
                        altura="h-[50px]" 
                        largura="w-full"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    
                    <Input 
                        id="senha" 
                        label="Senha" 
                        type="password" 
                        placeholder="********" 
                        altura="h-[50px]" 
                        largura="w-full"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    
                    <Button 
                        texto={isLoading ? "Entrando..." : "Entrar"} 
                        cor="bg-[#4F46E5]" 
                        hover="hover:bg-[#231c9b]" 
                        largura="w-full" 
                        altura="h-[48px]" 
                        margem="mb-5 mt-10" 
                        onClick={handleLogin}
                    />
                </AuthPanel>
            </div>
        </div>
    )
}