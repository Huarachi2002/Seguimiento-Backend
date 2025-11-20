<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

## Pasos para iniciar el proyecto

npm install

npm run build

// Crear la base de datos con el nombre de seguimiento_db en Postgres
//! En caso de cambiar el nombre de la bd tendra que tambien cambiar en el archivo .env

// En caso de no tener ninguna migracion en dicha carpeta
npm run migration:generate -- src/database/migrations/${NombreMigration}

// Si ya tiene migraciones o termino de crear
npm run migration:run

// Luego de tener las tablas listas en la bd
npm run seed:run

// Y por ultimo levantar proyecto
npm run start:dev

// o

## Pasos para iniciar el proyecto con Docker

```bash
# 1. Construir las imágenes (Elegir 1 // Recomendado 1.2.)
1.1. docker-compose build --no-cache 

1.2. docker-compose up --build -d

# 2. Iniciar los servicios
docker-compose up -d

# 3. Esperar a que la base de datos esté lista (unos 10 segundos)
# Si no tiene migraciones ejecutar el siguiente comando
docker exec -it seguimiento-backend npm run migration:generate -- src/database/migrations/InitialDB

# Luego ejecutar migraciones dentro del contenedor
docker exec -it seguimiento-backend npm run migration:run

# 4. Ejecutar seeders
docker exec -it seguimiento-backend npm run seed:run

# 5. Ver logs de la aplicación
docker-compose logs -f app

# 6. Detener servicios
docker-compose down
```

## Comandos útiles para Docker

```bash
# Reiniciar solo la aplicación (después de cambios)
docker-compose restart app

# Acceder al contenedor
docker exec -it seguimiento-backend sh

# Ver logs de la base de datos
docker-compose logs -f db

# Limpiar todo (cuidado: borra datos)
docker-compose down -v

# Generar nueva migración dentro del contenedor
docker exec -it seguimiento-backend npm run migration:generate -- src/database/migrations/NombreMigracion

# Revertir última migración
docker exec -it seguimiento-backend npm run migration:revert
```

npm run start:prod

## Pasos para iniciar el proyecto en Docker

```bash
# 1. Construir las imágenes
docker-compose build --no-cache

# 2. Iniciar los servicios (incluye migraciones y seeders automáticos)
docker-compose up -d

# 3. Ver logs
docker-compose logs -f app

# 4. Detener servicios
docker-compose down

# Comandos útiles:
# - Ejecutar migraciones manualmente: docker exec -it seguimiento-backend npm run migration:run
# - Ejecutar seeders manualmente: docker exec -it seguimiento-backend npm run seed:run
# - Acceder al contenedor: docker exec -it seguimiento-backend sh
# - Ver logs de la base de datos: docker-compose logs -f db
```

## Generar nuevas migraciones

```bash
# En local (recomendado)
npm run migration:generate -- src/database/migrations/NombreMigracion

# O dentro del contenedor
docker exec -it seguimiento-backend npm run migration:generate -- src/database/migrations/NombreMigracion
```

## Para etapas de Desarrollo utilizar Script de Poblacion para la base de datos

**Copia el script al contenedor:**
docker cp populate_database.sql seguimiento-db:/tmp/populate_database.sql

**Ejecuta el script dentro del contenedor:**
docker exec -it seguimiento-db psql -U postgres -d seguimiento_db -f /tmp/populate_database.sql

**Copia el script limpieza al contenedor:**
docker cp clean_database.sql seguimiento-db:/tmp/clean_database.sql

**Ejecuta el script limpieza dentro del contenedor:**
docker exec -it seguimiento-db psql -U postgres -d seguimiento_db -f /tmp/clean_database.sql