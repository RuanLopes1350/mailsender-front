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
            <div id={`tab-${text}`} className="bg-[#4F46E5] h-[58.8px] rounded-[10px] flex items-center justify-center gap-2 px-4 w-[318.15px] transition-all duration-300" onClick={handleClick}>
                {icon && (
                    <img src={`${icon}-white.png`} />
                )}
                <span>{text}</span>
            </div>
        )
    }

    return (
        <div className="bg-[#ffffff] h-[58.8px] rounded-[10px] flex items-center justify-center gap-2 px-4 w-[318.15px] cursor-pointer hover:text-white hover:bg-[#aca8e1] transition-all duration-300" onClick={handleClick}>
            {icon && (
                <img src={`${icon}-black.png`} />
            )}
            <span className="text-[#374151]">{text}</span>
        </div>
    )

}