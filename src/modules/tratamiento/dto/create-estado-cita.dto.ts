import {  IsNotEmpty, IsString } from "class-validator";

export class CreateEstadoCitaDto {
    
    @IsString()
    @IsNotEmpty()
    descripcion: string;

}