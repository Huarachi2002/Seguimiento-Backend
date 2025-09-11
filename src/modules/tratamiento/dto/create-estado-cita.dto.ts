import {  IsString } from "class-validator";

export class CreateEstadoCitaDto {
    
    @IsString()
    descripcion: string;

}