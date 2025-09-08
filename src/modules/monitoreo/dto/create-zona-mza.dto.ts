import { IsInt, IsOptional, IsString } from "class-validator";

export class CreateZonaMzaDto {

    @IsString()
    descripcion: string;

    @IsString()
    vertices: string;

    @IsString()
    idZonaUv: string;

}