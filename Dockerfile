# ==============================================================================
# ESTÁGIO 1: Dependências - Instalar todas as dependências
# ==============================================================================
FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copiar apenas package files para cache de camadas
COPY package.json package-lock.json* ./
RUN npm ci

# ==============================================================================
# ESTÁGIO 2: Builder - Build da aplicação
# ==============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar dependências do estágio anterior
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fonte
COPY . .

# Build-time args para variáveis NEXT_PUBLIC_*
ARG NEXT_PUBLIC_API_URI=http://localhost:5016/api
ENV NEXT_PUBLIC_API_URI=$NEXT_PUBLIC_API_URI

# Desabilitar telemetria do Next.js
ENV NEXT_TELEMETRY_DISABLED=1

# Build do Next.js (standalone mode)
RUN npm run build

# ==============================================================================
# ESTÁGIO 3: Runner - Imagem final de produção
# ==============================================================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copiar arquivos públicos
COPY --from=builder /app/public ./public

# Copiar output standalone do Next.js
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# server.js é criado pelo Next.js build com output standalone
CMD ["node", "server.js"]
