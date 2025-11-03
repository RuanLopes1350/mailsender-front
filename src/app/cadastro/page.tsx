"use client"

import AuthPanel from "@/components/auth-panel"
import Input from "@/components/input"
import Button from "@/components/button"
import { useGenerateApiKey } from "@/hooks/useData"
import { useState } from "react"

export default function CadastroPage() {
    const generateApiKey = useGenerateApiKey();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resposta, setResposta] = useState<string | null>(null);
    const [copiado, setCopiado] = useState(false);

    const gerarApiKey = async (name: string, email: string, pass: string) => {
        setError(null);
        setIsLoading(true);

        try {
            let response = await generateApiKey.mutateAsync({ name, email, pass });
            setResposta(response.apiKey);
        } catch (error: any) {
            setError(error.message || 'Erro ao gerar API Key');
        } finally {
            setIsLoading(false);
        }
    }

    const copiarParaClipboard = async () => {
        try {
            await navigator.clipboard.writeText(resposta || '');
            setCopiado(true);
            // Reseta após 2 segundos
            setTimeout(() => setCopiado(false), 2000);
        } catch (error) {
            console.error('Erro ao copiar:', error);
            alert('Erro ao copiar. Tente selecionar e copiar manualmente.');
        }
    }

    return (
        <div className="h-[calc(100vh-200px)] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 gap-6">
            <div className="w-full max-w-md">
                <div className="flex flex-col items-center gap-2">
                    <img src="/logo-purple.png" className="w-20 h-20 sm:w-24 sm:h-24 md:w-auto md:h-auto object-contain" alt="Logo Mail Sender" />
                    <h1 className="text-xl sm:text-2xl font-bold text-[#111827]">Mail Sender</h1>
                    <p className="text-[#4B5563] text-[12px] sm:text-[14px] pt-2">Painel Administrativo</p>
                </div>
            </div>

            {resposta ? (
                <div className="w-full max-w-md flex items-center justify-center px-4">
                    <AuthPanel titulo="Serviço Registrado!" subtitulo="Sua API Key foi gerada com sucesso" rodape="É um administrador?" rodapeLink="/login" rodapeLinkTexto="Painel Administrativo" altura="h-auto min-h-[408px]" largura="w-full">
                        <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-[10px] p-6">
                            <h1 className="text-[#166534] font-bold">⚠ATENÇÃO:</h1>
                            <p className="text-[#15803D] text-[11px]">Guarde esta chave em local seguro. Ela não será mostrada novamente!</p>
                            <div className="h-[44px] w-full bg-white rounded-[10px] flex items-center mt-4 mb-4 p-4 overflow-hidden">
                                {resposta.substring(0, 29) + '...'}
                            </div>
                            <Button
                                texto={copiado ? "✓ Copiado!" : "Copiar API Key"}
                                cor={copiado ? "bg-[#059669]" : "bg-[#16A34A]"}
                                hover="hover:bg-[#18592F]"
                                altura="h-[48px]"
                                largura="w-full"
                                margem="mb-5 mt-6"
                                onClick={copiarParaClipboard}
                            />
                        </div>
                        <Button texto="Voltar" cor="bg-[#4F46E5]" hover="hover:bg-[#231c9b]" largura="w-full" altura="h-[48px]" margem="mb-5 mt-10" onClick={() => setResposta('')} />
                    </AuthPanel>
                </div>
            ) : (
                <div className="w-full max-w-md flex items-center justify-center px-4">
                    <AuthPanel titulo="Cadastre seu projeto" rodape="É um administrador?" rodapeLink="/login" rodapeLinkTexto="Painel Administrativo" altura="h-auto min-h-[408px]" largura="w-full">
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-[10px] mb-4">
                                <p className="text-sm">{error}</p>
                            </div>
                        )}
                        <Input id="nome" label="Nome" type="text" placeholder="Meu Projeto" altura="h-[50px]" largura="w-full" onChange={(e) => setName(e.target.value)} />
                        <Input id="email" label="Email" type="email" placeholder="admin@example.com" altura="h-[50px]" largura="w-full" onChange={(e) => setEmail(e.target.value)} />
                        <Input id="senha" label="Senha" type="text" placeholder="ABCD 1234 EFGH 5678" altura="h-[50px]" largura="w-full" onChange={(e) => setPass(e.target.value)} />
                        <Button
                            texto={isLoading ? "Gerando..." : "Gerar API Key"}
                            cor="bg-[#4F46E5]"
                            hover="hover:bg-[#231c9b]"
                            largura="w-full"
                            altura="h-[48px]"
                            margem="mb-5 mt-10"
                            onClick={() => gerarApiKey(name, email, pass)}
                        />
                    </AuthPanel>
                </div>
            )}
        </div>
    )
}