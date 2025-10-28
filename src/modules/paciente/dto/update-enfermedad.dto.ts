import { IsOptional, IsString, IsBoolean } from "class-validator";

export class UpdateEnfermedadDto {
    @IsOptional()
    @IsString()
    descripcion?: string;

    @IsOptional()
    @IsBoolean()
    estado?: boolean;
}
