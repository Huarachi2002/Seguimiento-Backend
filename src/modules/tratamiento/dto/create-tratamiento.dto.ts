import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTratamientoDto {
    @IsString()
    @IsNotEmpty()
    idPaciente: string; // Input Frontend

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    codigo_diagnostico: string;

    @IsString()
    @IsNotEmpty()
    idTipoTratamiento: string;

    @IsString()
    @IsNotEmpty()
    idLocalizacionTb: string;

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    fecha_inicio: Date;

    @IsDate()
    @IsNotEmpty()
    @IsOptional()
    @Type(() => Date)
    fecha_fin: Date;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    regimen_medicacion: string;

    @IsInt()
    @IsNotEmpty()
    @IsOptional()
    dosis_total: number;

    @IsInt()
    @IsNotEmpty()
    @IsOptional()
    dosis_completa: number;

    @IsString()
    @IsNotEmpty()
    idEstado: string;

    @IsString()
    @IsNotEmpty()
    observaciones: string;
}