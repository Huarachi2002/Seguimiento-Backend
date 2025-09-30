# Etapa 1: Construcción (Builder)
FROM node:20-slim AS builder

# Establecer el directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema necesarias
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copiar archivos de configuración de dependencias
COPY package*.json ./

# Instalar todas las dependencias (incluyendo devDependencies)
RUN npm ci

# Copiar el código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa 2: Producción
FROM builder AS production

# Establecer el directorio de trabajo
WORKDIR /app

# Instalar las dependencias necesarias para ejecutar bcrypt
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copiar archivos de la etapa anterior
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Crear directorios necesarios
RUN mkdir -p ./uploads ./temp
RUN chmod -R 755 ./uploads ./temp

# Instalar solo las dependencias de producción
RUN npm ci --only=production && npm cache clean --force

# Exponer el puerto de la aplicación
EXPOSE 3001

# Configurar variables de entorno por defecto
ENV NODE_ENV=production

# Comando de inicio
CMD ["node", "dist/main"]
