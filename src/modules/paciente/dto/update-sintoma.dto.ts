import { IsOptional, IsString, IsBoolean } from "class-validator";

export class UpdateSintomaDto {
    @IsOptional()
    @IsString()
    descripcion?: string;

    @IsOptional()
    @IsBoolean()
    estado?: boolean;
}
