import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config()
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['src/modules/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts']
});