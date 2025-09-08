import { IsInt, IsOptional, IsString } from "class-validator";

export class UpdateDireccionDto {

    @IsOptional()
    @IsString()
    descripcion: string;

    @IsOptional()
    @IsString()
    idPaciente: string;

    @IsOptional()
    @IsString()
    idMza: string;

    @IsOptional()
    @IsInt()
    nro_casa: number;

    @IsOptional()
    @IsInt()
    latitud: number;

    @IsOptional()
    @IsInt()
    longitud: number;

}