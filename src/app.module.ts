import { Module } from '@nestjs/common';
import { PacienteModule } from './modules/paciente/paciente.module';
import { TratamientoModule } from './modules/tratamiento/tratamiento.module';
import { MonitoreoModule } from './modules/monitoreo/monitore.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST') || 'localhost',
        port: configService.get<number>('DB_PORT') ? parseInt(configService.get('DB_PORT')) : 5432,
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: false,
        migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
        migrationsRun: true
      }),
    }),
    PacienteModule, 
    TratamientoModule, 
    MonitoreoModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
