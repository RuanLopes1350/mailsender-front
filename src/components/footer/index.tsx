"use client";

import packageJson from '../../../package.json';

export default function Footer() {

    return (
        <div className="flex flex-col justify-center items-center pt-10 pb-10 px-4 text-center">
            <p className="text-sm md:text-base">Mail Sender v{packageJson.version} - Sistema de Envio de Emails</p>
            <p className="text-sm md:text-base">Desenvolvido por <a className="text-blue-500 hover:underline" href="https://github.com/RuanLopes1350" target="_blank" rel="noreferrer noopener">Ruan Lopes</a></p>
        </div>
    )
}