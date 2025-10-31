import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import QueryProvider from "@/providers/queryProvider";

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
      <body className="bg-linear-to-r from-[#EEF2FF] to-[#FAF5FF]">
        <QueryProvider>
          <Header />
          {children}
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
