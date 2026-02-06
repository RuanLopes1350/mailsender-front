"use client";

import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";
import Button from "@/components/button";
import { usePathname } from "next/navigation";

export default function NotFound() {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-r from-[#EEF2FF] to-[#FAF5FF]">

      {/* Container Principal */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-lg w-full text-center border border-indigo-100 relative overflow-hidden">

        {/* Elemento Decorativo de Fundo */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        {/* Ícone Animado */}
        <div className="relative mb-6 mx-auto w-24 h-24 flex items-center justify-center bg-indigo-50 rounded-full">
          <FileQuestion className="w-12 h-12 text-[#4F46E5] animate-bounce" />
        </div>

        {/* Títulos */}
        <h1 className="text-6xl font-bold text-[#111827] mb-2">404</h1>
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
          Página não encontrada
        </h2>

        <p className="text-gray-600 mb-8 text-sm md:text-base">
          Ocorreu uma falha na entrega desta rota. A página que você tentou acessar não existe ou foi movida.
        </p>

        {/* "Log" de Erro (Toque técnico para devs) */}
        <div className="bg-gray-900 rounded-lg p-4 mb-8 text-left overflow-hidden shadow-inner">
          <div className="flex gap-1.5 mb-3">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <code className="text-xs font-mono text-green-400 block">
            $ curl {pathname}
          </code>
          <code className="text-xs font-mono text-red-400 block mt-1">
            Error: 404 Not Found
          </code>
          <code className="text-xs font-mono text-gray-500 block mt-1">
            Status: Failed_lookup
          </code>
        </div>

        {/* Ações */}
        <div className="flex flex-col gap-3">
          <Link href="/" className="w-full">
            <Button
              texto="Início"
              cor="bg-[#4F46E5]"
              hover="hover:bg-[#4338ca]"
              altura="h-12"
              largura="w-full"
              icone={<Home size={18} className="mr-2" />}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}