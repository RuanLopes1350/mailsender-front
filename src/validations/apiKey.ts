import { z } from 'zod';

export const apiKeySchema = z.object({
    nome: z.string({message: 'Campo nome é obrigatório'}).min(3, 'Login deve conter no mínimo 3 caracteres').max(20, 'nome pode conter no máximo 20 caracteres'),
    email: z.email('Formato de email incorreto'),
    senha: z.string({message: 'Campo senha é obrigatório'}).min(19, 'Senha deve ter exatos 19 caracteres (contando espaços em branco)').max(19, 'Senha deve ter exatos 19 caracteres (contando espaços em branco)')
})