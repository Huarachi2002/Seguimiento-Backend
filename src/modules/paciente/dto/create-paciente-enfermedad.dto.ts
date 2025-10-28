import { IsNotEmpty, IsString } from "class-validator";

export class CreatePacienteEnfermedadDto {
    @IsString()
    @IsNotEmpty()
    idPaciente: string;

    @IsString()
    @IsNotEmpty()
    idEnfermedad: string;
}
