# ====================
# Etapa 1: Builder
# ====================
FROM node:20-slim AS builder

WORKDIR /app

# Instalar dependencias necesarias para compilar los módulos nativos
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copiar los archivos de package.json e instalar dependencias
COPY package*.json ./

# Instalar las dependencias
RUN npm ci

# Copiar el resto de los archivos
COPY . .

# Compilar la aplicación
RUN npm run build

# Verificar que el build fue exitoso
RUN ls -la dist/

# ====================
# Etapa 2: Producción
# ====================
FROM node:20-slim

WORKDIR /app

# Instalar las dependencias necesarias para ejecutar bcrypt y curl
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copiar archivos de la etapa anterior
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/data-source.ts ./
COPY --from=builder /app/dbConfig.ts ./
COPY --from=builder /app/tsconfig*.json ./
COPY --from=builder /app/src ./src

# Instalar TODAS las dependencias (incluye ts-node para migraciones y seeders)
RUN npm ci

# Verificar que dist existe
RUN ls -la && ls -la dist/

# Crear directorios necesarios
RUN mkdir -p ./uploads ./temp
RUN chmod -R 755 ./uploads ./temp

# Exponer el puerto que usa la aplicación
EXPOSE 3001

# Variables de entorno
ENV NODE_ENV=production

# Comando para iniciar la aplicación (migraciones y seeders se ejecutan manualmente)
CMD ["npm", "run", "start:prod"]
