import AuthPanel from "@/components/auth-panel"
import Input from "@/components/input"
import Button from "@/components/button"

export default function CadastroPage() {
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
                <AuthPanel titulo="Cadastre seu projeto" rodape="É um administrador?" rodapeLink="/login" rodapeLinkTexto="Painel Administrativo" altura="h-auto min-h-[408px]" largura="w-full">
                    <Input id="nome" label="Nome" type="text" placeholder="Meu Projeto" altura="h-[50px]" largura="w-full" />
                    <Input id="email" label="Email" type="email" placeholder="admin@example.com" altura="h-[50px]" largura="w-full" />
                    <Input id="senha" label="Senha" type="password" placeholder="********" altura="h-[50px]" largura="w-full" />
                    <Button texto="Gerar API Key" cor="bg-[#4F46E5]" hover="hover:bg-[#231c9b]" largura="w-full" altura="h-[48px]" margem="mb-5 mt-10" />
                </AuthPanel>
            </div>
        </div>
    )
}