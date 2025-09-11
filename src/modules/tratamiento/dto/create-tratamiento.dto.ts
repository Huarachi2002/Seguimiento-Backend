import { IsBoolean, IsDate, IsEmail, IsInt, IsString } from "class-validator";

export class CreateTratamientoDto {
    @IsString()
    idPaciente: string;

    @IsString()
    codigo_diagnostico: string;

    @IsString()
    idTipoTratamiento: string;

    @IsDate()
    fecha_inicio: Date;

    @IsDate()
    fecha_fin: Date;

    @IsString()
    regimen_medicacion: string;

    @IsInt()
    dosis_total: number;

    @IsInt()
    dosis_completa: number;

    @IsString()
    idEstado: string;

    @IsString()
    observaciones: string;
}