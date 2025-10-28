import { Module, forwardRef} from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LaboratorioService } from "./services/laboratorio.service";
import { LaboratorioController } from "./controllers/laboratorio.controller";
import { PacienteModule } from "../paciente/paciente.module";
import { TratamientoTB } from "../tratamiento/entities/tratamientoTB.entity";
import { Laboratorio } from "./entities/laboratorio.entity";
import { Tipo_Control } from "./entities/tipo_control.entity";
import { Tipo_Laboratorio } from "./entities/tipo_laboratorio.entity";
import { Tipo_Resultado } from "./entities/tipo_resultado.entity";
import { JwtStrategy } from "../auth/strategy/jwt.strategy";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Laboratorio,
            Tipo_Control,
            Tipo_Laboratorio,
            Tipo_Resultado
        ]),
        forwardRef(() => PacienteModule),
        AuthModule
    ],
    providers: [LaboratorioService],
    controllers: [LaboratorioController],
    exports: [LaboratorioService, TypeOrmModule]
})

export class LaboratorioModule {}