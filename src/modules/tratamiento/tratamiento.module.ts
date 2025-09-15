import { Module, forwardRef } from "@nestjs/common";
import { TratamientoService } from "./services/tratamiento.service";
import { TratamientoController } from "./controllers/tratamiento.controller";
import { UserService } from "./services/user.service";
import { CitaService } from "./services/cita.service";
import { CitaController } from "./controllers/cita.controller";
import { UserController } from "./controllers/user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TratamientoTB } from "./entities/tratamientoTB.entity";
import { Tipo_Tratamiento } from "./entities/tipo_tratamiento.entity";
import { Estado_Tratamiento } from "./entities/estado_tratamiento.entity";
import { Fase_Tratamiento } from "./entities/fase_tratamiento.entity";
import { Cita } from "./entities/cita.entity";
import { Tipo_Cita } from "./entities/tipo_cita.entity";
import { Estado_Cita } from "./entities/estado_cita.entity";
import { User } from "./entities/user.entity";
import { Rol } from "./entities/rol.entity";
import { PacienteModule } from "../paciente/paciente.module";


@Module({
    imports: [
        TypeOrmModule.forFeature([
            TratamientoTB,
            Tipo_Tratamiento,
            Estado_Tratamiento,
            Fase_Tratamiento,
            Cita,
            Tipo_Cita,
            Estado_Cita,
            User,
            Rol
        ]),
        forwardRef(() => PacienteModule)
    ],
    providers: [TratamientoService, CitaService, UserService],
    controllers: [TratamientoController, CitaController, UserController],
    exports: [TratamientoService, CitaService, UserService, TypeOrmModule]
})

export class TratamientoModule {}