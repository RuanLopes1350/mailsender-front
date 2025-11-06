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
        <div className={`bg-white ${largura} ${altura} p-4 sm:p-6 md:p-8 lg:p-10 rounded-[10px] shadow-2xl`}>
            <h1 className="text-[16px] sm:text-[18px] md:text-[20px] font-bold mb-4">{titulo}</h1>
            {subtitulo && (
                <p className="text-xs sm:text-sm md:text-base mb-4">{subtitulo}</p>
            )}
            {children}
            <div className="flex items-center justify-center mt-4">
                <p className="text-[9px] sm:text-[10px] md:text-[11px] text-[#4B5563] text-center">{rodape} {rodapeLink && rodapeLinkTexto && <Link className="text-[#4F46E5]" href={rodapeLink}>{rodapeLinkTexto}</Link>}</p>
            </div>
        </div>
    )
}