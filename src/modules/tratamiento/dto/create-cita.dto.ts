import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCitaDto {
    
    @IsString()
    @IsNotEmpty()
    idTratamiento: string;

    @IsString()
    idMotivo: string;

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    fecha_programada: Date;

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    fecha_actual: Date;

    @IsString()
    @IsNotEmpty()
    idEstado: string;

    @IsString()
    @IsNotEmpty()
    idTipo: string;

    @IsString()
    @IsNotEmpty()
    observaciones: string;

    @IsString()
    @IsNotEmpty()
    idUser: string;
}