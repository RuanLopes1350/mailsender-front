export default function Header() {
    return (
        <div className="xl:h-[136px] bg-linear-to-r from-[#4F46E5] to-[#9333EA] flex flex-col items-center justify-center mt-6 mb-6 px-4 max-w-[1850px] mx-auto rounded-2xl shadow-2xl">
            <div className="flex flex-row items-center gap-2">
                <img src="/logo-white.png" />
                <h1 className="text-2xl font-bold">Mail Sender</h1>
            </div>
            <p className="text-[#E0E7FF] text-[14px] pt-2">Painel Administrativo</p>
        </div>
    )
}