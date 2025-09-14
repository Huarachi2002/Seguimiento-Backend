import { IsNotEmpty, IsString } from "class-validator";

export class CreateZonaMzaDto {

    @IsString()
    @IsNotEmpty()
    descripcion: string;

    @IsString()
    @IsNotEmpty()
    vertices: string;

    @IsString()
    @IsNotEmpty()
    idZonaUv: string;

}