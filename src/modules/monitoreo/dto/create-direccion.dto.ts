import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateDireccionDto {
    @IsString()
    @IsNotEmpty()
    descripcion: string;

    @IsString()
    @IsNotEmpty()
    idPaciente: string;

    @IsString()
    @IsNotEmpty()
    idMza: string;

    @IsInt()
    @IsNotEmpty()
    nro_casa: number;

    @IsInt()
    @IsNotEmpty()
    latitud: number;

    @IsInt()
    @IsNotEmpty()
    longitud: number;

}