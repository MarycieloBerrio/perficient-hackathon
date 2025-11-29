# ---------- Stage 1: build ----------
FROM node:24.11.1-alpine AS builder

WORKDIR /app

# 1) Instalar dependencias
COPY package*.json ./
RUN npm install

# 2) Copiar el código fuente del frontend
COPY . .

# 3) Construir la app estática
RUN npm run build:docker


# ---------- Stage 2: runtime (servidor estático con nginx) ----------
FROM nginx:alpine

# 4) Copiar el build generado al directorio público de nginx
# Si tu build sale en "build" (CRA), cambia /app/dist por /app/build
COPY --from=builder /app/dist /usr/share/nginx/html

# 5) Puesto donde escuchará nginx dentro del contenedor
EXPOSE 80

# 6) Comando de arranque
CMD ["nginx", "-g", "daemon off;"]
