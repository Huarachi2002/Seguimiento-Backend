import { Module } from "@nestjs/common";
import { TratamientoService } from "./services/tratamiento.service";
import { TratamientoController } from "./controllers/tratamiento.controller";
import { UserService } from "./services/user.service";
import { CitaService } from "./services/cita.service";
import { CitaController } from "./controllers/cita.controller";
import { UserController } from "./controllers/user.controller";


@Module({
    providers: [TratamientoService, CitaService, UserService],
    controllers: [TratamientoController, CitaController, UserController],
})

export class TratamientoModule {}