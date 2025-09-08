import { IsBoolean, IsEmail, IsInt, IsOptional, IsString } from "class-validator";

export class UpdateTipoParentescoDto {

    @IsOptional()
    @IsString()
    descripcion: string;

    @IsOptional()
    @IsBoolean()
    estado: boolean;
}