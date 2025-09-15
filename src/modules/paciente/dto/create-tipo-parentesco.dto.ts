import { IsNotEmpty, IsString } from "class-validator";

export class CreateTipoParentescoDto {
    @IsString()
    @IsNotEmpty()
    descripcion: string;
}