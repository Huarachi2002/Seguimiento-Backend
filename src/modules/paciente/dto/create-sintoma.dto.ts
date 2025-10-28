import { IsNotEmpty, IsString, IsOptional, IsBoolean } from "class-validator";

export class CreateSintomaDto {
    @IsString()
    @IsNotEmpty()
    descripcion: string;

    @IsOptional()
    @IsBoolean()
    estado?: boolean;
}
