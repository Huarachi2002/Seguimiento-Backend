import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEmail, IsInt, IsOptional, IsString } from "class-validator";

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
    @IsDate()
    @Type(() => Date)
    fecha_nacimiento: Date;

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