# Deps
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package*.json ./
RUN npm ci

# Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Run
FROM node:20-alpine AS run
WORKDIR /app
ENV NODE_ENV=production PORT=3001
RUN apk add --no-cache curl
RUN npm i -g pm2@latest

COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY ecosystem.config.cjs ./ecosystem.config.cjs
RUN mkdir -p /app/data
EXPOSE 3001

HEALTHCHECK --interval=10s --timeout=3s --retries=5 \
  CMD curl -fsS "http://127.0.0.1:${PORT:-3001}/api/health" || exit 1

CMD ["pm2-runtime", "start", "ecosystem.config.cjs"]
