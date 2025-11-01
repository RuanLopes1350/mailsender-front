import Link from "next/link";

interface AuthPanelProps {
    titulo: string;
    subtitulo?: string;
    rodape: string;
    rodapeLink?: string;
    rodapeLinkTexto?: string;
    altura: string;
    largura: string;
    children: React.ReactNode
}

export default function AuthPanel({ titulo, subtitulo, rodape, rodapeLink, rodapeLinkTexto, altura, largura, children }: AuthPanelProps) {
    return (
        <div className={`bg-white ${largura} ${altura} p-6 sm:p-8 md:p-10 rounded-[10px] shadow-2xl`}>
            <h1 className="text-[18px] sm:text-[20px] font-bold">{titulo}</h1>
            {subtitulo && (
                <p className="text-sm sm:text-base">{subtitulo}</p>
            )}
            {children}
            <div className="flex items-center justify-center">
                <p className="text-[10px] sm:text-[11px] text-[#4B5563] text-center">{rodape} {rodapeLink && rodapeLinkTexto && <Link className="text-[#4F46E5]" href={rodapeLink}>{rodapeLinkTexto}</Link>}</p>
            </div>
        </div>
    )
}