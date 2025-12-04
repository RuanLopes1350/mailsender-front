// Tipos para a API

export interface EmailStats {
    total: number;
    enviados: number;
    falhas: number;
}

export interface RequestStats {
    total: number;
    byEndpoint: Record<string, number>;
    byUser: Record<string, number>;
}

export interface Email {
    _id: string;
    to: string;
    sender: string;
    subject: string;
    template: string;
    status: 'pending' | 'sent' | 'failed';
    apiKeyUser?: ApiKey;
    createdAt: string;
    sentAt?: string;
    error?: string;
}

export interface EmailDetails extends Email {
    data?: Record<string, any>;
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
    email: string;
    pass: string;
}

export interface GenerateApiKeyResponse {
    name: string;
    message: string;
    apiKey: string;
    isActive: boolean;
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

export interface DeleteAdminResponse {
    message: string;
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

// ==================== CONFIG ====================

export interface ConfigResponse {
    success?: boolean;
    data?: Config;
    message?: string;
}

export interface Config {
    _id: string;
    aprovarApiKey: boolean;
    retentativas: number;
    intervaloRetentativas: number;
    rateLimitRequests: number;
    rateLimitWindowMs: number;
    __v: number;
}

// ==================== ADMIN ====================

export interface IAdmin {
    _id: string;
    username: string;
    password: string;
}
