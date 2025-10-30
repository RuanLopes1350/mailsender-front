interface CardInfoProps {
    icon?: string;
    number: number;
    description: string;

}

export default function CardInfo({icon, number, description}: CardInfoProps) {
    return (
        <div className="bg-white w-[360px] h-[172px] rounded-2xl flex flex-col pt-4 pb-4 pl-6 pr-6 gap-4 border">
            <img className="h-[48px] w-[48px]" src={icon}/>
            <h1 className="text-[#111827] font-bold text-3xl">{number}</h1>
            <p className="text-[#4B5563] text-[14px]">{description}</p>
        </div>
    )
}