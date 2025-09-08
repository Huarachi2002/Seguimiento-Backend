import { IsString } from "class-validator";

export class CreateZonaUvDto {

    @IsString()
    descripcion: string;

    @IsString()
    vertices: string;

}