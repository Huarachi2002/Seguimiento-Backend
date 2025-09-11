import {  IsString } from "class-validator";

export class CreateEstadoTratamientoDto {
    
    @IsString()
    descripcion: string;

}