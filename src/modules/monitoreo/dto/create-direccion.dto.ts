import { IsInt, IsNotEmpty, IsString, IsDecimal,  } from "class-validator";

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

    @IsNotEmpty()
    latitud: number;

    @IsNotEmpty()
    longitud: number;

}