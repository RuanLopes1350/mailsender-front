interface CardInfoProps {
    icon?: string;
    number: number;
    description: string;

}

export default function CardInfo({ icon, number, description }: CardInfoProps) {
    return (
        <div className="bg-white w-full min-h-[172px] rounded-2xl flex flex-col p-4 md:p-6 gap-4 border shadow-sm">
            <img className="h-10 w-10 md:h-12 md:w-12" src={icon} alt={description} />
            <h1 className="text-[#111827] font-bold text-2xl md:text-3xl">{number}</h1>
            <p className="text-[#4B5563] text-xs md:text-sm">{description}</p>
        </div>
    )
}