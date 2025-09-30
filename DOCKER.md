# Seguimiento Backend - Guía de Docker

## 🐳 Configuración Docker

Este proyecto está completamente dockerizado para facilitar el desarrollo y el despliegue.

### Prerrequisitos

- Docker
- Docker Compose

### 🚀 Comandos Rápidos

```bash
# Desarrollo con hot-reload
npm run docker:dev

# Producción
npm run docker:prod

# Solo base de datos
npm run docker:db

# Ver logs
npm run docker:logs

# Detener servicios
npm run docker:stop
```

### 📁 Estructura Docker

```
├── Dockerfile              # Dockerfile optimizado para producción
├── Dockerfile.dev          # Dockerfile para desarrollo
├── docker-compose.yml      # Configuración de producción
├── docker-compose.dev.yml  # Configuración de desarrollo
├── .dockerignore           # Archivos excluidos del contexto
├── .env.example            # Variables de entorno de ejemplo
└── .env.production         # Variables para producción
```

### 🛠️ Desarrollo

Para desarrollar con Docker:

```bash
# 1. Copiar variables de entorno
cp .env.example .env

# 2. Iniciar en modo desarrollo
npm run docker:dev
```

Esto iniciará:
- 📦 PostgreSQL en puerto 5432
- 🚀 NestJS con hot-reload en puerto 3000
- 🔍 Debug port en 9229

### 🚀 Producción

Para desplegar en producción:

```bash
# 1. Configurar variables de producción
cp .env.production .env

# 2. Construir e iniciar
npm run docker:prod
```

### 📊 Monitoreo

```bash
# Ver logs en tiempo real
docker-compose logs -f

# Estado de los servicios
docker-compose ps

# Estadísticas de recursos
docker stats
```

### 🗃️ Base de Datos

```bash
# Solo iniciar PostgreSQL
npm run docker:db

# Ejecutar migraciones
npm run migration:run

# Ejecutar seeds
npm run seed:run
```

### 🔧 Comandos Docker Útiles

```bash
# Construir solo la imagen
npm run docker:build

# Limpiar sistema Docker
npm run docker:clean

# Acceder al contenedor
docker exec -it seguimiento-backend sh

# Ver logs específicos
docker logs seguimiento-backend
```

### 🌐 URLs de Acceso

- **API**: http://localhost:3000
- **PostgreSQL**: localhost:5432
- **Debug**: localhost:9229

### 🔄 Workflow de Desarrollo

1. **Clonar el proyecto**
   ```bash
   git clone <repository>
   cd Seguimiento-Backend
   ```

2. **Configurar entorno**
   ```bash
   cp .env.example .env
   # Editar .env con tus configuraciones
   ```

3. **Iniciar desarrollo**
   ```bash
   npm run docker:dev
   ```

4. **Desarrollar**
   - Los cambios se reflejan automáticamente
   - Hot-reload activado
   - Debug disponible en puerto 9229

5. **Ejecutar migraciones**
   ```bash
   npm run migration:run
   ```

### 🐛 Troubleshooting

**Puerto ocupado:**
```bash
# Cambiar puerto en docker-compose.yml
ports:
  - "3001:3000"  # Usar puerto 3001 en lugar de 3000
```

**Problemas de permisos:**
```bash
# Limpiar volúmenes
docker-compose down -v
npm run docker:dev
```

**Cache de Docker:**
```bash
# Reconstruir sin cache
docker-compose build --no-cache
```

### 📝 Notas

- El Dockerfile usa multi-stage build para optimizar el tamaño
- Las imágenes de desarrollo incluyen herramientas de debugging
- Los volúmenes permiten hot-reload en desarrollo
- Health checks aseguran que los servicios estén listos antes de conectar