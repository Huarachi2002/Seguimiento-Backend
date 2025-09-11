import {  IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateEstadoTratamientoDto {
    
    @IsOptional()
    @IsString()
    descripcion: string;

    @IsOptional()
    @IsBoolean()
    estado: boolean;
}