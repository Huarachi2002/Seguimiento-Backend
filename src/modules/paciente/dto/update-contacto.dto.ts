import { IsBoolean, IsEmail, IsInt, IsOptional, IsString } from "class-validator";

export class UpdateContactoDto {

    @IsOptional()
    @IsString()
    nombre: string;

    @IsOptional()
    @IsString()
    id_paciente: string;

    @IsOptional()
    @IsString()
    id_tipo_parentesco: string;

    @IsOptional()
    @IsString()
    nombre_contacto: string;

    @IsOptional()
    @IsString()
    numero_telefono_contacto: string;

    @IsOptional()
    @IsString()
    direccion: string;

    @IsOptional()
    @IsBoolean()
    emergencia: boolean;

    @IsOptional()
    @IsBoolean()
    tiene_whatsapp: boolean;
}