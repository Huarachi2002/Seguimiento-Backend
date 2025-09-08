import { IsBoolean, IsEmail, IsInt, IsString } from "class-validator";

export class CreatePacienteDto {
    @IsString()
    nombre: string;

    @IsString()
    numero_doc: string;

    @IsInt()
    tipo_doc: number;

    @IsString()
    fecha_nacimiento: string;

    @IsInt()
    genero: number;

    @IsEmail()
    email: string;

    @IsBoolean()
    tiene_whatsapp: boolean;

}