import { Type } from "class-transformer"
import { IsDate, IsNotEmpty, IsString } from "class-validator"


export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    username: string

    @IsString()
    @IsNotEmpty()
    nombre: string

    @IsString()
    @IsNotEmpty()
    constrasena: string

    @IsString()
    @IsNotEmpty()
    idRol: string

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    fecha_login: Date
}
