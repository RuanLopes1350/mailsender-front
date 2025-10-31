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
        <div className={`bg-white ${largura} ${altura} p-10`}>
            <h1 className="text-[20px] font-bold">{titulo}</h1>
            {subtitulo && (
                <p>{subtitulo}</p>
            )}
            {children}
            <p className="text-[11px] text-[#4B5563]">{rodape} {rodapeLink && rodapeLinkTexto && <Link className="text-[#4F46E5]" href={rodapeLink}>{rodapeLinkTexto}</Link>}</p>
        </div>
    )
}