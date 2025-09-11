import {  IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateEstadoCitaDto {
    
    @IsOptional()
    @IsString()
    descripcion: string;

    @IsOptional()
    @IsBoolean()
    estado: boolean;
}