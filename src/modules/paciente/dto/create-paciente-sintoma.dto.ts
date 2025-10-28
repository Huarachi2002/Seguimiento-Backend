import { IsNotEmpty, IsString } from "class-validator";

export class CreatePacienteSintomaDto {
    @IsString()
    @IsNotEmpty()
    idPaciente: string;

    @IsString()
    @IsNotEmpty()
    idSintoma: string;
}
