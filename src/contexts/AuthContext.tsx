"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/authService';
import { setJwtToken, removeJwtToken } from '@/services/apiClient';
import type { User } from '@/types/api';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Verifica se há um token salvo ao carregar a aplicação
    useEffect(() => {
        const token = authService.getToken();
        const savedUser = authService.getUser();

        if (token && savedUser) {
            setUser(savedUser);
            setJwtToken(token); // Configura o token no apiClient
        }

        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await authService.login(email, password);

            console.log('Resposta do login:', response);

            // Verifica se o login foi bem-sucedido
            if (response.success && response.token && response.user) {
                // Garante que o user tenha os campos obrigatórios
                const user: User = {
                    id: response.user.id || 'unknown',
                    email: response.user.email || email,
                    name: response.user.name
                };
                setUser(user);
                setJwtToken(response.token); // Configura o token no apiClient
            } else {
                // Se não tem sucesso, lança erro com a mensagem do servidor
                throw new Error(response.message || 'Erro ao fazer login');
            }
        } catch (error: any) {
            console.error('Erro no AuthContext:', error);
            // Se o erro já é um Error, relança
            if (error instanceof Error) {
                throw error;
            }
            // Caso contrário, cria um novo erro
            throw new Error(error?.message || 'Erro ao fazer login');
        }
    };

    const logout = () => {
        authService.logout();
        removeJwtToken(); // Remove o token do apiClient
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}
