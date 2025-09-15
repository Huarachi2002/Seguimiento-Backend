import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEmail, IsInt, IsOptional, IsString } from "class-validator";

export class UpdateCitaDto {
    
    @IsOptional()
    @IsString()
    idTratamiento: string;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    fecha_programada: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    fecha_actual: Date;

    @IsOptional()
    @IsString()
    idEstado: string;

    @IsOptional()
    @IsString()
    idTipo: string;

    @IsOptional()
    @IsString()
    observaciones: string;

    @IsOptional()
    @IsString()
    idUser: string;
}