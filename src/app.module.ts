import { Module } from '@nestjs/common';
import { PacienteModule } from './modules/paciente/paciente.module';
import { TratamientoModule } from './modules/tratamiento/tratamiento.module';
import { MonitoreoModule } from './modules/monitoreo/monitore.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LaboratorioModule } from './modules/laboratorio/laboratorio.module';
import { AuthModule } from './modules/auth/auth.module';

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
        synchronize: false,
        logging: true,
        migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
        migrationsRun: false
      }),
    }),
    PacienteModule, 
    TratamientoModule, 
    MonitoreoModule,
    LaboratorioModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
