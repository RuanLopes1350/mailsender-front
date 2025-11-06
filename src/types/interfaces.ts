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