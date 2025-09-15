import { IsNotEmpty, IsString } from "class-validator";

export class CreateZonaUvDto {

    @IsString()
    @IsNotEmpty()
    descripcion: string;

    @IsString()
    @IsNotEmpty()
    vertices: string;

}