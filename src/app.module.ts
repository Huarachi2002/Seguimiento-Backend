import { Module } from '@nestjs/common';
import { PacienteModule } from './modules/paciente/paciente.module';
import { TratamientoModule } from './modules/tratamiento/tratamiento.module';
import { MonitoreoModule } from './modules/monitoreo/monitore.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'hiachi20',
      database: process.env.DB_DATABASE || 'seguimiento_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: false,
      migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
      migrationsRun: true,
    }),
    PacienteModule, 
    TratamientoModule, 
    MonitoreoModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
