# syntax=docker/dockerfile:1

###############################################################################
# base - runtime Node comum a todos os estagios
###############################################################################
FROM node:24-alpine AS base
WORKDIR /app
# libc6-compat: algumas dependencias nativas precisam em Alpine
RUN apk add --no-cache libc6-compat
ENV NEXT_TELEMETRY_DISABLED=1

###############################################################################
# deps - instala dependencias com cache de camada
###############################################################################
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm install

###############################################################################
# dev - ambiente de desenvolvimento com hot reload
# O codigo-fonte entra por bind mount (ver docker-compose.yml),
# node_modules fica em volume proprio do container.
###############################################################################
FROM base AS dev
ENV NODE_ENV=development
# Bind mount no Windows/WSL nao propaga eventos inotify de forma confiavel;
# o polling garante que o hot reload funcione.
ENV WATCHPACK_POLLING=true
ENV CHOKIDAR_USEPOLLING=true
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

###############################################################################
# builder - compila a aplicacao para producao
###############################################################################
FROM base AS builder
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

###############################################################################
# runner - imagem final de producao (Next.js standalone)
###############################################################################
FROM base AS runner
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000 HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
