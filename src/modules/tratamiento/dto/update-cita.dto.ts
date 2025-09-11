import { IsBoolean, IsDate, IsEmail, IsInt, IsOptional, IsString } from "class-validator";

export class UpdateCitaDto {
    
    @IsOptional()
    @IsString()
    idTratamiento: string;

    @IsOptional()
    @IsDate()
    fecha_programada: Date;

    @IsOptional()
    @IsDate()
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