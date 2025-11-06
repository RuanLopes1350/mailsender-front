"use client"

import AuthPanel from "@/components/auth-panel"
import Input from "@/components/input"
import Button from "@/components/button"
import { useGenerateApiKey } from "@/hooks/useData"
import { useState } from "react"
import { apiKeySchema } from "../validations/apiKey"
import { ZodError } from "zod"
import { IZodError } from "@/types/interfaces"

export default function CadastroPage() {
    const generateApiKey = useGenerateApiKey();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<IZodError[] | null>(null);
    const [resposta, setResposta] = useState<string | null>(null);
    const [copiado, setCopiado] = useState(false);

    const gerarApiKey = async (name: string, email: string, pass: string) => {
        setError(null);
        setIsLoading(true);

        const apiKey = {
            nome: name,
            email: email,
            senha: pass
        }

        try {
            apiKeySchema.parse(apiKey)
            let response = await generateApiKey.mutateAsync({ name, email, pass });
            setResposta(response.apiKey);
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
        <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center p-2 sm:p-4 md:p-8 gap-3 sm:gap-4 md:gap-6 py-4 sm:py-6 md:py-8">
            <div className="w-full max-w-md px-2 sm:px-0">
                <div className="flex flex-col items-center gap-1 sm:gap-2">
                    <img src="/logo-purple.png" className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain" alt="Logo Mail Sender" draggable='false' />
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#111827]">Mail Sender</h1>
                    <p className="text-[#4B5563] text-[11px] sm:text-[12px] md:text-[14px] pt-1 sm:pt-2">Painel Administrativo</p>
                </div>
            </div>

            {resposta ? (
                <div className="w-full max-w-md flex items-center justify-center px-2 sm:px-4">
                    <AuthPanel titulo="Serviço Registrado!" subtitulo="Sua API Key foi gerada com sucesso" rodape="É um administrador?" rodapeLink="/login" rodapeLinkTexto="Painel Administrativo" altura="h-auto" largura="w-full">
                        <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-[10px] p-4 sm:p-6">
                            <h1 className="text-[#166534] font-bold text-sm sm:text-base">⚠ATENÇÃO:</h1>
                            <p className="text-[#15803D] text-[10px] sm:text-[11px]">Guarde esta chave em local seguro. Ela não será mostrada novamente!</p>
                            <div className="h-[40px] sm:h-[44px] w-full bg-white rounded-[10px] flex items-center mt-3 sm:mt-4 mb-3 sm:mb-4 p-3 sm:p-4 overflow-hidden text-xs sm:text-sm">
                                {resposta.substring(0, 29) + '...'}
                            </div>
                            <Button
                                texto={copiado ? "✓ Copiado!" : "Copiar API Key"}
                                cor={copiado ? "bg-[#059669]" : "bg-[#16A34A]"}
                                hover="hover:bg-[#18592F]"
                                altura="h-[42px] sm:h-[48px]"
                                largura="w-full"
                                margem="mb-3 sm:mb-5 mt-4 sm:mt-6"
                                onClick={copiarParaClipboard}
                            />
                        </div>
                        <Button texto="Voltar" cor="bg-[#4F46E5]" hover="hover:bg-[#231c9b]" largura="w-full" altura="h-[42px] sm:h-[48px]" margem="mb-3 sm:mb-5 mt-6 sm:mt-8 md:mt-10" onClick={() => setResposta('')} />
                    </AuthPanel>
                </div>
            ) : (
                <div className="w-full max-w-md flex items-center justify-center px-2 sm:px-4">
                    <AuthPanel titulo="Cadastre seu projeto" rodape="É um administrador?" rodapeLink="/login" rodapeLinkTexto="Painel Administrativo" altura="h-auto" largura="w-full">
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded-[10px] mt-2 sm:mt-4" role="alert">
                                <p className="text-xs sm:text-sm">{error[0].mensagem}</p>
                            </div>
                        )}
                        <div className="space-y-3 sm:space-y-4">
                            <Input id="nome" label="Nome" type="text" placeholder="Meu Projeto" altura="h-[42px] sm:h-[50px]" largura="w-full" onChange={(e) => setName(e.target.value)} />
                            <Input id="email" label="Email" type="email" placeholder="admin@example.com" altura="h-[42px] sm:h-[50px]" largura="w-full" onChange={(e) => setEmail(e.target.value)} />
                            <Input id="senha" label="Senha" type="text" placeholder="ABCD 1234 EFGH 5678" altura="h-[42px] sm:h-[50px]" largura="w-full" onChange={(e) => setPass(e.target.value)} />
                        </div>
                        <Button
                            texto={isLoading ? "Gerando..." : "Gerar API Key"}
                            cor="bg-[#4F46E5]"
                            hover="hover:bg-[#231c9b]"
                            largura="w-full"
                            altura="h-[42px] sm:h-[48px]"
                            margem="mb-3 sm:mb-5 mt-6 sm:mt-8 md:mt-10"
                            onClick={() => gerarApiKey(name, email, pass)}
                        />
                    </AuthPanel>
                </div>
            )}
        </div>
    )
}