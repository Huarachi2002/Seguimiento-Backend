import {  IsString } from "class-validator";

export class CreateTipoCitaDto {
    
    @IsString()
    descripcion: string;

}