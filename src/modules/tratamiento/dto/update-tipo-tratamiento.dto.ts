import {  IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateTipoTratamientoDto {
    
    @IsOptional()
    @IsString()
    descripcion: string;

    @IsOptional()
    @IsBoolean()
    estado: boolean;
}