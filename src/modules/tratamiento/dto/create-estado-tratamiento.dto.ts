import {  IsNotEmpty, IsString } from "class-validator";

export class CreateEstadoTratamientoDto {
    
    @IsString()
    @IsNotEmpty()
    descripcion: string;

}