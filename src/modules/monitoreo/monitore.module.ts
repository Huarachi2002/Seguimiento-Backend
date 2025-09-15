import { Module, forwardRef} from "@nestjs/common";
import { MonitoreoService } from "./services/monitoreo.service";
import { MonitoreoController } from "./controllers/monitoreo.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Direccion } from "./entities/direccion.entity";
import { Zona_Mza } from "./entities/zona_mza.entity";
import { Zona_Uv } from "./entities/zona_uv.entity";
import { DireccionService } from "./services/direccion.service";
import { DireccionController } from "./controllers/direccion.controller";
import { PacienteModule } from "../paciente/paciente.module";
import { TratamientoModule } from "../tratamiento/tratamiento.module";
import { Cita } from "../tratamiento/entities/cita.entity";
import { Paciente } from "../paciente/entities/paciente.entity";
import { TratamientoTB } from "../tratamiento/entities/tratamientoTB.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Direccion, 
            Zona_Mza, 
            Zona_Uv,
            Paciente,
            Cita,
            TratamientoTB
        ]),
        forwardRef(() => PacienteModule),
        forwardRef(() => TratamientoModule)
    ],
    providers: [MonitoreoService, DireccionService],
    controllers: [MonitoreoController, DireccionController],
    exports: [MonitoreoService, DireccionService, TypeOrmModule]
})

export class MonitoreoModule {}