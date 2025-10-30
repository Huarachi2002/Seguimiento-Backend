import { IsNotEmpty, IsString } from "class-validator";

export class IncidenciaTbDto {

    @IsString()
    @IsNotEmpty()
    descripcion: string;

    @IsString()
    @IsNotEmpty()
    valor: number;

}