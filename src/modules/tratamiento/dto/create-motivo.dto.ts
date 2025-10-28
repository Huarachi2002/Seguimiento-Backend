import { IsNotEmpty, IsString } from "class-validator";

export class CreateMotivoDto {
    @IsString()
    @IsNotEmpty()
    descripcion: string;

    // estado opcional al crear
    @IsNotEmpty()
    estado?: boolean;
}
