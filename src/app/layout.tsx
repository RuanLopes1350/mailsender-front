import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header";

export const metadata: Metadata = {
  title: "Mail Sender",
  description: "Microserviço de envio de e-mails",
  keywords: ["email", "microservice", "node.js", "typescript", "next.js"],
  authors: [{ name: "Ruan Lopes", url: "https://ruanlopes.is-a.dev" }]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#FFFFFF]">
        <Header />
        {children}
      </body>
    </html>
  );
}
