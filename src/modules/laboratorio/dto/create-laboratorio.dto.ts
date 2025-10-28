import { IsString, IsNotEmpty, IsDateString, IsOptional } from "class-validator";

export class CreateLaboratorioDto {
    @IsString()
    @IsNotEmpty()
    codigo: string;

    @IsDateString()
    @IsNotEmpty()
    fecha: Date;

    @IsString()
    @IsNotEmpty()
    observacion: string;

    @IsString()
    @IsNotEmpty()
    idPaciente: string;

    @IsString()
    @IsNotEmpty()
    idTipoControl: string;

    @IsString()
    @IsNotEmpty()
    idTipoLaboratorio: string;

    @IsString()
    @IsNotEmpty()
    idTipoResultado: string;
}