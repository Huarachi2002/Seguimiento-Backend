import {  IsNotEmpty, IsString } from "class-validator";

export class CreateRolDto {
    
    @IsString()
    @IsNotEmpty()
    descripcion: string;

}