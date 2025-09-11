import { IsBoolean, IsDate, IsEmail, IsInt, IsString } from "class-validator";

export class CreatePacienteDto {
    @IsString()
    nombre: string;

    @IsString()
    numero_doc: string;

    @IsInt()
    tipo_doc: number;

    @IsDate()
    fecha_nacimiento: Date;

    @IsInt()
    genero: number;

    @IsEmail()
    email: string;

    @IsBoolean()
    tiene_whatsapp: boolean;

}