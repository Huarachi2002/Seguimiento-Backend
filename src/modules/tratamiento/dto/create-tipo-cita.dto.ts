import {  IsNotEmpty, IsString } from "class-validator";

export class CreateTipoCitaDto {
    
    @IsString()
    @IsNotEmpty()
    descripcion: string;

}