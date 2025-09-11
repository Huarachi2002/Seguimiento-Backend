import { IsBoolean, IsDate, IsEmail, IsInt, IsOptional, IsString } from "class-validator";

export class CreateCitaDto {
    
    @IsString()
    idTratamiento: string;

    @IsDate()
    fecha_programada: Date;

    @IsDate()
    fecha_actual: Date;

    @IsString()
    idEstado: string;

    @IsString()
    idTipo: string;

    @IsString()
    observaciones: string;

    @IsString()
    idUser: string;
}