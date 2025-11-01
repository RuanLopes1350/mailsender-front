// Tipos para a API

export interface EmailStats {
    total: number;
    enviados: number;
    falhados: number;
}

export interface RequestStats {
    total: number;
    byEndpoint: Record<string, number>;
    byUser: Record<string, number>;
}

export interface Email {
    _id: string;
    to: string;
    subject: string;
    template: string;
    status: 'pending' | 'sent' | 'failed';
    apiKeyUser: string;
    createdAt: string;
    sentAt?: string;
    error?: string;
}

export interface ApiKey {
    _id: string;
    nome: string;
    prefixo: string;
    ativa: boolean;
    criadoEm: string;
    ultimoUso?: string;
}

export interface RequestLog {
    _id: string;
    method: string;
    path: string;
    statusCode: number;
    apiKeyUser?: string;
    createdAt: string;
    responseTime?: number;
}

export interface GeneralStats {
    emails: EmailStats;
    requests: RequestStats;
    recentEmails: Email[];
    recentActivity: RequestLog[];
}

export interface HealthCheckResponse {
    ok: boolean;
    message: string;
    createdAt: string;
}

export interface StatusResponse {
    ok: boolean;
    startTime: number;
    uptime: number;
    uptimeFormatted: string;
}

export interface GenerateApiKeyRequest {
    name: string;
}

export interface GenerateApiKeyResponse {
    name: string;
    message: string;
    apiKey: string;
}

export interface SendEmailRequest {
    to: string;
    subject: string;
    template: string;
    data?: Record<string, any>;
}

export interface SendEmailResponse {
    message: string;
    emailId: string;
}

// ==================== AUTH ====================

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    success?: boolean;
    message?: string;
    token?: string;
    user?: {
        id?: string;
        email?: string;
        name?: string;
        username?: string;
    };
    // Campos alternativos que o backend pode retornar
    mensagem?: string;
    usuario?: any;
}

export interface User {
    id: string;
    email: string;
    name?: string;
}
