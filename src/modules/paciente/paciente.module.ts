import { Module } from "@nestjs/common";
import { PacienteService } from "./services/paciente.service";
import { PacienteController } from "./controllers/paciente.controller";
import { Paciente } from "./entities/paciente.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Contacto_Paciente } from "./entities/contacto.entity";
import { Tipo_Parentesco } from "./entities/tipo_parentesco.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Paciente, Contacto_Paciente, Tipo_Parentesco]),
    ],
    providers: [PacienteService],
    controllers: [PacienteController  ],
})
export class PacienteModule {}