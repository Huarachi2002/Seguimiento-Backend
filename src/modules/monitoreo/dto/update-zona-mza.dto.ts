import { IsInt, IsOptional, IsString } from "class-validator";

export class UpdateZonaMzaDto {

    @IsOptional()
    @IsString()
    descripcion: string;

    @IsOptional()
    @IsString()
    vertices: string;

    @IsOptional()
    @IsString()
    idZonaUv: string;

}