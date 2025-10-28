import { IsNotEmpty, IsString, IsOptional, IsBoolean } from "class-validator";

export class CreateEnfermedadDto {
    @IsString()
    @IsNotEmpty()
    descripcion: string;

    @IsOptional()
    @IsBoolean()
    estado?: boolean;
}
