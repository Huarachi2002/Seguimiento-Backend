import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class UpdateAssistantDto {
    
    @IsString()
    @IsNotEmpty()
    id_paciente: string;

    @IsNotEmpty()
    fecha_programada: string;

    @IsInt()
    @IsNotEmpty()
    id_estado: number;

    @IsString()
    @IsNotEmpty()
    motivo: string;
}