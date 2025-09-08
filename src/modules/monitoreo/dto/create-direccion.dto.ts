import { IsInt, IsString } from "class-validator";

export class CreateDireccionDto {
    @IsString()
    descripcion: string;

    @IsString()
    idPaciente: string;

    @IsString()
    idMza: string;

    @IsInt()
    nro_casa: number;

    @IsInt()
    latitud: number;

    @IsInt()
    longitud: number;

}