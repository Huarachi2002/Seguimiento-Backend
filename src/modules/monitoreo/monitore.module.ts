import { Module } from "@nestjs/common";
import { MonitoreoService } from "./services/monitoreo.service";
import { MonitoreoController } from "./controllers/monitoreo.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Direccion } from "./entities/direccion.entity";
import { Zona_Mza } from "./entities/zona_mza.entity";
import { Zona_Uv } from "./entities/zona_uv.entity";
import { DireccionService } from "./services/direccion.service";
import { DireccionController } from "./controllers/direccion.controller";
import { PacienteService } from "../paciente/services/paciente.service";
import { Paciente } from "../paciente/entities/paciente.entity";


@Module({
    imports: [
        TypeOrmModule.forFeature([Direccion, Zona_Mza, Zona_Uv, Paciente]),
    ],
    providers: [MonitoreoService, DireccionService, PacienteService],
    controllers: [MonitoreoController, DireccionController],
})

export class MonitoreoModule {}