import { IsBoolean, IsEmail, IsInt, IsString } from "class-validator";

export class CreateTipoParentescoDto {
    @IsString()
    descripcion: string;
}