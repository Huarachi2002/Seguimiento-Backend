import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { pgConfig } from '../../dbConfig';

config()


const options: DataSourceOptions & SeederOptions = {
  ...pgConfig,
  // type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  // entities: [ 'src/**/*.entity{.ts,.js}'],
  // migrations: ['src/database/migrations/*{.ts,.js}'],
  factories: ['src/seeding/*.factory{.ts,.js}'],
  seeds: ['src/seeding/main.seeder{.ts,.js}'],
  synchronize: false,
  logging: false,
}

const AppDataSource = new DataSource(options);
AppDataSource.initialize().then(async ()=> {
  console.log('Data Source has been initialized!')
  await AppDataSource.synchronize(true);
  await runSeeders(AppDataSource);
  process.exit();
})