import { Module } from "@nestjs/common";
import { TratamientoService } from "./services/tratamiento.service";
import { TratamientoController } from "./controllers/tratamiento.controller";


@Module({
    providers: [TratamientoService],
    controllers: [TratamientoController],
})

export class TratamientoModule {}