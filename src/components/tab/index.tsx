"use client";
import { useState } from "react";

interface TabProps {
    icon?: string;
    text: string;
    selected: boolean;
    onSelect: () => void;
}

export default function Tab({ icon, text, selected, onSelect }: TabProps) {
    const handleClick = () => {
        console.log(`Tab ${text} clicked`);
        onSelect();
    }
    if (selected) {
        return (
            <div id={`tab-${text}`} className="bg-[#4F46E5] h-[58.8px] rounded-[10px] flex items-center justify-center gap-2 px-4 w-full md:w-[380px] transition-all duration-300 shadow-2xl cursor-pointer" onClick={handleClick}>
                {icon && (
                    <img src={`${icon}-white.png`} className="w-5 h-5" alt={text} />
                )}
                <span className="text-white font-bold text-sm md:text-base">{text}</span>
            </div>
        )
    }

    return (
        <div className="bg-[#ffffff] border h-[58.8px] rounded-[10px] flex items-center justify-center gap-2 px-4 w-full md:w-[380px] cursor-pointer hover:text-white hover:bg-[#aca8e1] transition-all duration-300" onClick={handleClick}>
            {icon && (
                <img src={`${icon}-black.png`} className="w-5 h-5" alt={text} />
            )}
            <span className="text-[#374151] text-sm md:text-base">{text}</span>
        </div>
    )

}