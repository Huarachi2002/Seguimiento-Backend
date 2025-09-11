import { IsDate, IsString } from "class-validator"


export class CreateUserDto {

    @IsString()
    username: string

    @IsString()
    nombre: string

    @IsString()
    constrasena: string

    @IsString()
    idRol: string

    @IsDate()
    fecha_login: Date
}
