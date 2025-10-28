import { Module, forwardRef } from "@nestjs/common";
import { PacienteService } from "./services/paciente.service";
import { PacienteController } from "./controllers/paciente.controller";
import { Paciente } from "./entities/paciente.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Contacto_Paciente } from "./entities/contacto.entity";
import { Tipo_Parentesco } from "./entities/tipo_parentesco.entity";
import { Direccion } from "../monitoreo/entities/direccion.entity";
import { MonitoreoModule } from "../monitoreo/monitore.module";
import { Laboratorio } from "../laboratorio/entities/laboratorio.entity";
import { Enfermedad } from "./entities/enfermedad.entity";
import { Paciente_Enfermedad } from "./entities/paciente_enfermedad.entity";
import { Sintoma } from "./entities/sintoma.entity";
import { Paciente_Sintoma } from "./entities/paciente_sintoma.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Paciente,
            Contacto_Paciente,
            Tipo_Parentesco,
            Direccion,
            Laboratorio,
            Enfermedad,
            Paciente_Enfermedad,
            Sintoma,
            Paciente_Sintoma
        ]),
        forwardRef(()=> MonitoreoModule)
    ],
    providers: [PacienteService],
    controllers: [PacienteController],
    exports: [PacienteService, TypeOrmModule]
})
export class PacienteModule {}