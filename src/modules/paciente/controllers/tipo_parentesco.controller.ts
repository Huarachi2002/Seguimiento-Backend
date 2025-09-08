import { Body, Controller, Get, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { CreatePacienteDto } from "../dto/create-paciente.dto";
import { UpdatePacienteDto } from "../dto/update-paciente.dto";
import { PacienteService } from "../services/paciente.service";
import { IApiResponse } from "src/common/interface/api-response.interface";
import { CreateTipoParentescoDto } from "../dto/create-tipo-parentesco.dto";
import { TipoParentescoService } from "../services/tipo_parentesco.service";
import { UpdateTipoParentescoDto } from "../dto/update-tipo-parentesco.dto";


@Controller('tipo-parentesco')
export class TipoParentescoController {

    constructor(
        private tipoParentescoService: TipoParentescoService
    ){}

    @Get()
    async getTipoParentescos(): Promise<IApiResponse> {
        const data = await this.tipoParentescoService.findAll();
        return {
            statusCode: HttpStatus.OK,
            message: 'Lista de tipos de parentesco',
            data
        };
    }

    @Get(':id')
    async getTipoParentescoById(@Param('id') id: string) {
        const data = await this.tipoParentescoService.findOne(id);
        return {
            statusCode: HttpStatus.OK,
            message: 'Detalles del tipo de parentesco',
            data
        };
    }

    @Post()
    async createTipoParentesco(@Body() createTipoParentescoDto: CreateTipoParentescoDto) {
        const data = await this.tipoParentescoService.create(createTipoParentescoDto);
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Tipo de parentesco creado',
            data
        };
    }

    @Put(':id')
    async updateTipoParentesco(@Param('id') id: string, @Body() updateTipoParentescoDto: UpdateTipoParentescoDto) {
        await this.tipoParentescoService.update(id, updateTipoParentescoDto);
        return {
            statusCode: HttpStatus.OK,
            message: 'Tipo de parentesco actualizado',
            data: null
        };
    }

}