interface ButtonProps {
    texto: string;
    cor: string;
    altura: string;
    largura: string;
    margem?: string;
    hover?: string;
    onClick?: () => void;
    onKeyDown?: () => void;
}

export default function Button({ texto, cor, altura, largura, hover, margem, onClick, onKeyDown }: ButtonProps) {
    return (
        <div onClick={onClick} onKeyDown={onKeyDown} className={`rounded-[10px] shadow-2xl flex items-center justify-center font-bold text-white cursor-pointer ${cor} ${altura} ${largura} ${hover} ${margem}`}>{texto}</div>
    )
}