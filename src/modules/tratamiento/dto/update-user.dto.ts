import { IsDate, IsOptional, IsString } from "class-validator"


export class UpdateUserDto {

    @IsOptional()
    @IsString()
    username: string

    @IsOptional()
    @IsString()
    nombre: string

    @IsOptional()
    @IsString()
    constrasena: string

    @IsOptional()
    @IsString()
    idRol: string

    @IsOptional()
    @IsDate()
    fecha_login: Date
}