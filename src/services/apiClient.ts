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
} from '@/types/api';

const apiUrl = process.env.NEXT_PUBLIC_API_URI || 'http://localhost:5016/api';

const apiClient = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para adicionar API Key se necessário
export const setApiKey = (apiKey: string) => {
    apiClient.defaults.headers.common['x-api-key'] = apiKey;
};

export const removeApiKey = () => {
    delete apiClient.defaults.headers.common['x-api-key'];
};

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

export default apiClient;