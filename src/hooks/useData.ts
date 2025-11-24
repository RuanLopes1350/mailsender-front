import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/services/apiClient';
import type { GenerateApiKeyRequest, SendEmailRequest } from '@/types/api';

// ==================== STATS & HEALTH ====================

export const useHealthCheck = () => {
    return useQuery({
        queryKey: ['health'],
        queryFn: api.getHealthCheck,
    });
};

export const useStatus = () => {
    return useQuery({
        queryKey: ['status'],
        queryFn: api.getStatus,
    });
};

export const useGeneralStats = () => {
    return useQuery({
        queryKey: ['generalStats'],
        queryFn: api.getGeneralStats,
        refetchInterval: 10000, // Atualiza a cada 10 segundos
    });
};

// ==================== API KEYS ====================

export const useApiKeys = () => {
    return useQuery({
        queryKey: ['apiKeys'],
        queryFn: api.listApiKeys,
    });
};

export const useGenerateApiKey = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: GenerateApiKeyRequest) => api.generateApiKey(request),
        onSuccess: () => {
            // Invalida a query de API Keys para refetch
            queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
        },
    });
};

export const useRevokeApiKey = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (name: string) => api.revokeApiKey(name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
        },
    });
};

export const useDeactivateApiKey = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (name: string) => api.deactivateApiKey(name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
        },
    });
};

export const useReactivateApiKey = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (name: string) => api.reactivateApiKey(name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
        },
    });
};

// ==================== CONFIG ====================

export const useConfig = () => {
    return useQuery({
        queryKey: ['config'],
        queryFn: api.getConfigs,
        refetchInterval: 10000, // Atualiza a cada 10 segundos
    });
};

export const useApproveApiKey = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => api.approveApiKey(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
            queryClient.invalidateQueries({ queryKey: ['config'] });
        },
    });
};

// ==================== EMAILS ====================

export const useRecentEmails = (limit: number = 10) => {
    return useQuery({
        queryKey: ['recentEmails', limit],
        queryFn: () => api.getRecentEmails(limit),
    });
};

export const useMyEmails = () => {
    return useQuery({
        queryKey: ['myEmails'],
        queryFn: api.getMyEmails,
    });
};

export const useSendEmail = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: SendEmailRequest) => api.sendEmail(request),
        onSuccess: () => {
            // Invalida queries relacionadas a emails
            queryClient.invalidateQueries({ queryKey: ['recentEmails'] });
            queryClient.invalidateQueries({ queryKey: ['myEmails'] });
            queryClient.invalidateQueries({ queryKey: ['generalStats'] });
        },
    });
};

export const useEmailDetails = (emailId: string, enabled: boolean = false) => {
    return useQuery({
        queryKey: ['emailDetails', emailId],
        queryFn: () => api.getEmailDetails(emailId),
        enabled: enabled && !!emailId, // Só busca se enabled for true e emailId existir
    });
}

// ==================== CONFIG ====================

export const useCreateAdminUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { username: string; password: string }) => api.createAdminUser(data.username, data.password),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['config'] });
        },
    });
};