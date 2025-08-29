# ----- deps -----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ----- build (needs node_modules + ts) -----
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY --from=deps /app/node_modules ./node_modules 
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ----- run -----
FROM node:20-alpine AS run
WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache curl

COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
RUN mkdir -p /app/data
EXPOSE 3001
CMD ["node", "dist/index.js"]
