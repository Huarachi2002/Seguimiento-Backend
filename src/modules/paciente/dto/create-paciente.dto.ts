import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEmail, IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreatePacienteDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    numero_doc: string;

    @IsInt()
    @IsNotEmpty()
    tipo_doc: number;

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    fecha_nacimiento: Date;

    @IsInt()
    @IsNotEmpty()
    genero: number;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsBoolean()
    @IsNotEmpty()
    tiene_whatsapp: boolean;

}