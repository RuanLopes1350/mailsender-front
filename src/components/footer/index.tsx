"use client";

import packageJson from '../../../package.json';

export default function Footer() {

    return (
        <div className="flex flex-col justify-center items-center pt-10 pb-10">
            <p>Mail Sender v{packageJson.version} - Sistema de Envio de Emails</p>
            <p>Desenvolvido por <a className="text-blue-500" href="https://github.com/RuanLopes1350" target="_blank" rel="noreferrer noopener">Ruan Lopes</a></p>
        </div>
    )
}