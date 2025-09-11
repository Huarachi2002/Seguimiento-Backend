import {  IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateRolDto {

    @IsOptional()
    @IsString()
    descripcion: string;
}