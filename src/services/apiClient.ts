import axios from 'axios';
import type {
    GeneralStats,
    HealthCheckResponse,
    StatusResponse,
    ApiKey,
    GenerateApiKeyRequest,
    GenerateApiKeyResponse,
    Email,
    SendEmailRequest,
    SendEmailResponse,
    RequestLog,
    ConfigResponse,
    EmailDetails,
} from '@/types/api';

const apiUrl = process.env.NEXT_PUBLIC_API_URI || 'http://localhost:5016/api';

const apiClient = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para adicionar token automaticamente em todas as requisições
apiClient.interceptors.request.use(
    (config) => {
        // Pega o token do localStorage
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('auth_token');
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para tratar erros de autenticação
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Se receber 401 (não autorizado), redireciona para login
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Funções auxiliares para gerenciar API Key
export const setApiKey = (apiKey: string) => {
    apiClient.defaults.headers.common['x-api-key'] = apiKey;
};

export const removeApiKey = () => {
    delete apiClient.defaults.headers.common['x-api-key'];
};

// Funções auxiliares para gerenciar token JWT (usadas pelo AuthContext)
export const setJwtToken = (token: string) => {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export const removeJwtToken = () => {
    delete apiClient.defaults.headers.common['Authorization'];
}

// ==================== STATS & HEALTH ====================

export const getHealthCheck = async (): Promise<HealthCheckResponse> => {
    const { data } = await apiClient.get<HealthCheckResponse>('/');
    return data;
};

export const getStatus = async (): Promise<StatusResponse> => {
    const { data } = await apiClient.get<StatusResponse>('/status');
    return data;
};

export const getGeneralStats = async (): Promise<GeneralStats> => {
    const { data } = await apiClient.get<GeneralStats>('/stats');
    return data;
};

// ==================== API KEYS ====================

export const generateApiKey = async (request: GenerateApiKeyRequest): Promise<GenerateApiKeyResponse> => {
    const { data } = await apiClient.post<GenerateApiKeyResponse>('/keys/generate', request);
    return data;
};

export const listApiKeys = async (): Promise<ApiKey[]> => {
    const { data } = await apiClient.get<ApiKey[]>('/keys');
    return data;
};

export const revokeApiKey = async (name: string): Promise<{ message: string }> => {
    const { data } = await apiClient.delete<{ message: string }>(`/keys/${name}`);
    return data;
};

export const deactivateApiKey = async (name: string): Promise<{ message: string }> => {
    const { data } = await apiClient.patch<{ message: string }>(`/keys/${name}/inativar`);
    return data;
};

export const reactivateApiKey = async (name: string): Promise<{ message: string }> => {
    const { data } = await apiClient.patch<{ message: string }>(`/keys/${name}/reativar`);
    return data;
};

// ==================== EMAILS ====================

export const sendEmail = async (request: SendEmailRequest): Promise<SendEmailResponse> => {
    const { data } = await apiClient.post<SendEmailResponse>('/emails/send', request);
    return data;
};

export const getRecentEmails = async (limit: number = 10): Promise<Email[]> => {
    const { data } = await apiClient.get<Email[]>(`/emails/recentes?limit=${limit}`);
    return data;
};

export const getMyEmails = async (): Promise<Email[]> => {
    const { data } = await apiClient.get<Email[]>('/emails/meus');
    return data;
};

export const getEmailDetails = async (emailId: string): Promise<EmailDetails> => {
    const { data } = await apiClient.get<EmailDetails>(`/emails/detalhes/${emailId}`);
    return data;
}

export default apiClient;

// ==================== CONFIG ====================

export const getConfigs = async (): Promise<ConfigResponse> => {
    const { data } = await apiClient.get<ConfigResponse>('/config');
    return data;
};

export const approveApiKey = async (): Promise<{ message: boolean }> => {
    const { data } = await apiClient.post<{ message: boolean }>(`/config/aprovar`);
    return data;
}

// ==================== ADMIN ====================

export const createAdminUser = async (username: string, password: string): Promise<{ message: string }> => {
    const { data } = await apiClient.post<{ message: string }>('/admin/criar', { username, password });
    return data;
}