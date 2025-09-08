import { IsBoolean, IsEmail, IsInt, IsOptional, IsString } from "class-validator";

export class UpdatePacienteDto {

    @IsOptional()
    @IsString()
    nombre: string;

    @IsOptional()
    @IsString()
    numero_doc: string;

    @IsOptional()
    @IsInt()
    tipo_doc: number;

    @IsOptional()
    @IsString()
    fecha_nacimiento: string;

    @IsOptional()
    @IsInt()
    genero: number;

    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsBoolean()
    tiene_whatsapp: boolean;

    @IsOptional()
    @IsBoolean()
    estado: boolean;
}