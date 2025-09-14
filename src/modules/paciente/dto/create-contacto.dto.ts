import { IsBoolean, IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateContactoDto {

    @IsString()
    @IsNotEmpty()
    id_paciente: string;

    @IsString()
    @IsNotEmpty()
    id_tipo_parentesco: string;

    @IsString()
    @IsNotEmpty()
    nombre_contacto: string;

    @IsString()
    @IsNotEmpty()
    numero_telefono_contacto: string;

    @IsString()
    @IsNotEmpty()   
    direccion: string;

    @IsBoolean()
    @IsNotEmpty()
    emergencia: boolean;

    @IsBoolean()
    @IsNotEmpty()
    tiene_whatsapp: boolean;
}