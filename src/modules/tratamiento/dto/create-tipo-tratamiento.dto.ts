import {  IsNotEmpty, IsString } from "class-validator";

export class CreateTipoTratamientoDto {
    
    @IsString()
    @IsNotEmpty()
    descripcion: string;

}