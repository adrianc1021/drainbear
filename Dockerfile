FROM mcr.microsoft.com/playwright:v1.62.0-noble AS builder

WORKDIR /app

RUN corepack enable \
  && corepack prepare pnpm@10.4.1 --activate

COPY package.json pnpm-lock.yaml ./
COPY patches ./patches

RUN pnpm install --frozen-lockfile

COPY . .

ARG VITE_GOOGLE_ADS_WHATSAPP_LABEL
RUN pnpm build

FROM node:22-bookworm-slim AS production

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/index.js"]
