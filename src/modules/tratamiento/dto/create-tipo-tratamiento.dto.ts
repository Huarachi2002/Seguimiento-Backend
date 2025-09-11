import {  IsString } from "class-validator";

export class CreateTipoTratamientoDto {
    
    @IsString()
    descripcion: string;

}