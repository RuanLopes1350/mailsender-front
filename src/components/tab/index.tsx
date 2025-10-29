interface TabProps {
    icon?: string;
    text: string;
}

export default function Tab({ icon, text }: TabProps) {
    return (
        <div className="bg-[#4F46E5] h-[58.8px] rounded-[10px] flex items-center justify-center gap-2 px-4 w-[318.15px] cursor-pointer hover:bg-[#2c21c0] transition-colors">
            {icon && (
                <img src={icon}/>
            )}
            <span>{text}</span>
        </div>
    )
}