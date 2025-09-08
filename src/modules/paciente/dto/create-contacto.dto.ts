import { IsBoolean, IsInt, IsString } from "class-validator";

export class CreateContactoDto {

    @IsString()
    id_paciente: string;

    @IsString()
    id_tipo_parentesco: string;

    @IsString()
    nombre_contacto: string;

    @IsString()
    numero_telefono_contacto: string;

    @IsString()
    direccion: string;

    @IsBoolean()
    emergencia: boolean;

    @IsBoolean()
    tiene_whatsapp: boolean;
}