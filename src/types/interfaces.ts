import { User } from "./api";

export interface IZodError {
    mensagem: string;
    code?: number;
}

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

export interface EmailGenerico {
    nomeSistema?: string;
    nome?: string;
    mensagem?: string;
    mensagemSecundaria?: string;
    itens?: string[];
    mostrarBotao?: boolean;
    textoBotao?: string;
    urlBotao?: string;
    corPrimaria?: string;
    corBotao?: string;
    corDestaque?: string;
    logoUrl?: string;
    infoAdicional?: string;
    textoFooter?: string;
    mostrarLinks?: boolean;
    linkSite?: string;
    linkSuporte?: string;
    linkPrivacidade?: string;
}