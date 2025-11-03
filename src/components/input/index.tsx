interface InputProps {
    id: string;
    type: string;
    label?: string;
    placeholder: string;
    largura: string;
    altura: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function Input({ id, type, label, placeholder, altura, largura, value, onChange, onKeyPress }: InputProps) {
    return (
        <div className="flex flex-col mt-4 mb-4 gap-2">
            <label className="" htmlFor={id}>{label}</label>
            <input
                className={`${altura} ${largura} p-4 rounded-[10px] border`}
                id={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onKeyPress={onKeyPress}
            />
        </div>
    )
}