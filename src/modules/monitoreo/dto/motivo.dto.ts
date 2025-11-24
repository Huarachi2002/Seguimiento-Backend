import { IsDate, IsNotEmpty } from "class-validator";
import { Type } from "class-transformer";

export class MotivoDto {

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    fecha_inicio: Date;

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    fecha_fin: Date;

}