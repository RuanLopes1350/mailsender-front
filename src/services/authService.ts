import axios from 'axios';
import type { LoginRequest, LoginResponse } from '@/types/api';

const apiUrl = process.env.NEXT_PUBLIC_API_URI || 'http://localhost:5016/api';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

// Serviço de Autenticação
// Gerencia login, logout e armazenamento de token/
export const authService = {
    // Realiza login e armazena o token
    async login(username: string, password: string): Promise<LoginResponse> {
        try {
            const { data } = await axios.post<any>(
                `${apiUrl}/login`,
                { username, password }
            );

            console.log('Dados recebidos do backend:', data);

            // Verifica se tem o token necessário
            if (!data.token && !data.accessToken) {
                throw new Error('Token não fornecido pelo servidor');
            }

            // Cria o objeto user garantindo os campos obrigatórios
            const userData = data.user || data.usuario || {};
            const user = {
                id: userData.id || userData._id || 'unknown',
                email: userData.email || userData.username || username,
                name: userData.name || userData.nome || userData.username || username
            };

            // Normaliza a resposta para o formato esperado
            const normalizedResponse: LoginResponse = {
                success: data.success !== false, // Assume sucesso se não vier false
                message: data.message || data.mensagem || 'Login realizado',
                token: data.token || data.accessToken,
                user: user
            };

            console.log('Resposta normalizada:', normalizedResponse);

            // Armazena o token e os dados do usuário no localStorage
            this.setToken(normalizedResponse.token!);
            this.setUser(user);
            normalizedResponse.success = true;

            return normalizedResponse;
        } catch (error: any) {
            console.error('Erro na requisição de login:', error);
            console.error('Response data:', error.response?.data);

            // Se o erro tem uma resposta do servidor
            if (error.response?.data) {
                throw new Error(
                    error.response.data.message ||
                    error.response.data.mensagem ||
                    error.response.data.error ||
                    'Erro ao fazer login'
                );
            }

            throw new Error('Erro ao conectar com o servidor');
        }
    },

    // Faz logout e limpa os dados 
    logout(): void {
        this.removeToken();
        this.removeUser();
    },

    // Salva o token no localStorage
    setToken(token: string): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(TOKEN_KEY, token);
        }
    },

    // Recupera o token do localStorage
    getToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(TOKEN_KEY);
        }
        return null;
    },

    // Remove o token do localStorage
    removeToken(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(TOKEN_KEY);
        }
    },

    // Salva os dados do usuário no localStorage
    setUser(user: any): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(USER_KEY, JSON.stringify(user));
        }
    },

    // Recupera os dados do usuário do localStorage
    getUser(): any | null {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem(USER_KEY);
            return user ? JSON.parse(user) : null;
        }
        return null;
    },

    // Remove os dados do usuário do localStorage
    removeUser(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(USER_KEY);
        }
    },

    // Verifica se o usuário está autenticado
    isAuthenticated(): boolean {
        return this.getToken() !== null;
    },
};
