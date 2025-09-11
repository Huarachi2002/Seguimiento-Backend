import {  IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateTipoCitaDto {
    
    @IsOptional()
    @IsString()
    descripcion: string;

    @IsOptional()
    @IsBoolean()
    estado: boolean;
}