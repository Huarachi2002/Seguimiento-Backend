import { Module } from "@nestjs/common";
import { PacienteService } from "./services/paciente.service";
import { PacienteController } from "./controllers/paciente.controller";
import { Paciente } from "./entities/paciente.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContactoService } from "./services/contacto.service";
import { TipoParentescoService } from "./services/tipo_parentesco.service";
import { ContactoController } from "./controllers/contacto.controller";
import { TipoParentescoController } from "./controllers/tipo_parentesco.controller";
import { Contacto_Paciente } from "./entities/contacto.entity";
import { Tipo_Parentesco } from "./entities/tipo_parentesco.entity";
import { Telefono } from "./entities/telefono.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Paciente, Contacto_Paciente, Tipo_Parentesco, Telefono]),
    ],
    providers: [PacienteService, ContactoService, TipoParentescoService],
    controllers: [PacienteController, ContactoController, TipoParentescoController],
})

export class PacienteModule {}