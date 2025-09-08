import { IsOptional, IsString } from "class-validator";

export class UpdateZonaUvDto {

    @IsOptional()
    @IsString()
    descripcion: string;

    @IsOptional()
    @IsString()
    vertices: string;

}