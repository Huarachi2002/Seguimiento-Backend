import { Body, Controller, Get, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { PacienteService } from "../../paciente/services/paciente.service";
import { IApiResponse } from "src/common/interface/api-response.interface";
import { DireccionService } from "../services/direccion.service";
import { CreateDireccionDto } from "../dto/create-direccion.dto";
import { UpdateDireccionDto } from "../dto/update-direccion.dto";


@Controller('direccion')
export class DireccionController {

    constructor(
        private pacienteService: PacienteService,
        private direccionService: DireccionService
    ){}

    @Get(':idPaciente')
    getDirrecionByPaciente(@Param('idPaciente') id: string) {
        const paciente = this.pacienteService.findOne(id)
        if (!paciente) {
            return {
                statusCode: HttpStatus.NOT_FOUND,
                message: 'Paciente no encontrado',
                data: null
            }
        }

        return this.direccionService.findOneByPaciente(id).then(data => ({
            statusCode: HttpStatus.OK,
            message: 'Detalles de la direccion',
            data
        }));
    }

    @Post()
    async createDireccion(@Body() createDireccionDto: CreateDireccionDto): Promise<IApiResponse> {
        const paciente = await this.pacienteService.findOne(createDireccionDto.idPaciente);
        if (!paciente) {
            return Promise.resolve({
                statusCode: HttpStatus.NOT_FOUND,
                message: 'Paciente no encontrado',
                data: null
            });
        }

        return this.direccionService.create(createDireccionDto, paciente).then(data => ({
            statusCode: HttpStatus.CREATED,
            message: 'Direccion creada',
            data
        }));
    }

    @Put(':id')
    async updateDireccion(@Param('id') id: string, @Body() updateDireccionDto: UpdateDireccionDto): Promise<IApiResponse> {
        await this.direccionService.update(id, updateDireccionDto);
        return Promise.resolve( {
            statusCode: HttpStatus.OK,
            message: 'Direccion actualizada',
            data: null
        });
    }

}