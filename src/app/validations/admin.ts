import { z } from 'zod'

export const adminSchema = z.object({
    login: z.string('Campo login é obrigatório').min(3, 'Campo login deve ter no mínimo 3 caracteres').max(20,'Campo login deve ter no máximo 20 caracteres'),
    senha: z.string('Campo senha é obrigatório').min(8,'Campo senha deve ter no mínimo 3 caracteres').max(20, 'Campo login deve ter no máximo 20 caracteres')
})