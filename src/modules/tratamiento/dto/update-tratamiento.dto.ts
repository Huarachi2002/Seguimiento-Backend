import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEmail, IsInt, IsOptional, IsString } from "class-validator";

export class UpdateTratamientoDto {
    @IsOptional()
    @IsString()
    idPaciente: string;

    @IsOptional()
    @IsString()
    codigo_diagnostico: string;

    @IsOptional()
    @IsString()
    idTipoTratamiento: string;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    fecha_inicio: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    fecha_fin: Date;

    @IsOptional()
    @IsString()
    regimen_medicacion: string;

    @IsOptional()
    @IsInt()
    dosis_total: number;

    @IsOptional()
    @IsInt()
    dosis_completa: number;

    @IsOptional()
    @IsString()
    idEstado: string;

    @IsOptional()
    @IsString()
    observaciones: string;
}