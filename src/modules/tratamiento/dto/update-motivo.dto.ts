import { IsOptional, IsString, IsBoolean } from "class-validator";

export class UpdateMotivoDto {
    @IsOptional()
    @IsString()
    descripcion?: string;

    @IsOptional()
    @IsBoolean()
    estado?: boolean;
}
