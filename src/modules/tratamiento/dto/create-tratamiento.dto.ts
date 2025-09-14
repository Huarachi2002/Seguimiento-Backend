import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEmail, IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateTratamientoDto {
    @IsString()
    @IsNotEmpty()
    idPaciente: string;

    @IsString()
    @IsNotEmpty()
    codigo_diagnostico: string;

    @IsString()
    @IsNotEmpty()
    idTipoTratamiento: string;

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    fecha_inicio: Date;

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    fecha_fin: Date;

    @IsString()
    @IsNotEmpty()
    regimen_medicacion: string;

    @IsInt()
    @IsNotEmpty()
    dosis_total: number;

    @IsInt()
    @IsNotEmpty()
    dosis_completa: number;

    @IsString()
    @IsNotEmpty()
    idEstado: string;

    @IsString()
    @IsNotEmpty()
    observaciones: string;
}