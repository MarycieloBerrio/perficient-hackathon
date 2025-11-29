# ---------- Stage 1: build ----------
FROM node:24.11.1-alpine AS builder

WORKDIR /app

# 1) Copiamos solo el package.json del backend
COPY package*.json ./
RUN npm install

# 2) Copiamos tsconfig y el código fuente del backend
COPY tsconfig.json ./
COPY src ./src

# 3) Compilamos TypeScript -> dist/
RUN npm run build


# ---------- Stage 2: runtime ----------
FROM node:24.11.1-alpine

WORKDIR /app
ENV NODE_ENV=production

# 4) Dependencias solo de producción del backend
COPY package*.json ./
RUN npm install --omit=dev

# 5) Copiamos el build generado en el stage anterior
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Ajusta el entrypoint según tu Nest
CMD ["node", "dist/main.js"]  # o dist/server.js si ese es tu entrypoint real
