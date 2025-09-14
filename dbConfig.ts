import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";


export const pgConfig: PostgresConnectionOptions = {
    url: process.env.DB_URL,
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    entities: [ 'src/**/*.entity{.ts,.js}']
}