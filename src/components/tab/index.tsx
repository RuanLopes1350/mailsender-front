"use client";

interface TabProps {
    icon?: string;
    text: string;
    selected: boolean;
}

export default function Tab({ icon, text, selected }: TabProps) {
    const handleClick = () => {
        console.log(`Tab ${text} clicked`);
        selected = true;
    }
    if (selected) {
        return (
            <div className="bg-[#4F46E5] h-[58.8px] rounded-[10px] flex items-center justify-center gap-2 px-4 w-[318.15px]" onClick={handleClick}>
                {icon && (
                    <img src={`${icon}-white.png`} />
                )}
                <span>{text}</span>
            </div>
        )
    }
    
    return (
        <div className="bg-[#ffffff] h-[58.8px] rounded-[10px] flex items-center justify-center gap-2 px-4 w-[318.15px] cursor-pointer hover:text-white hover:bg-[#aca8e1] transition-colors" onClick={handleClick}>
            {icon && (
                <img src={`${icon}-black.png`} />
            )}
            <span className="text-[#374151]">{text}</span>
        </div>
    )

}