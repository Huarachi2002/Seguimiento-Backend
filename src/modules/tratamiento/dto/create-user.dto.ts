import { Type } from "class-transformer"
import { IsBoolean, IsDate, IsNotEmpty, IsString } from "class-validator"


export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    contrasena: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    telefono: string;

    @IsBoolean()
    @IsNotEmpty()
    notificar_email: boolean;

    @IsBoolean()
    @IsNotEmpty()
    notificar_whatsapp: boolean;

    @IsString()
    @IsNotEmpty()
    idRol: string;

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    fecha_login: Date;
}
