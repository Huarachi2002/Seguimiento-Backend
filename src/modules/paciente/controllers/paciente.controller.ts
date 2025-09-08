import { Body, Controller, Get, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { CreatePacienteDto } from "../dto/create-paciente.dto";
import { UpdatePacienteDto } from "../dto/update-paciente.dto";
import { PacienteService } from "../services/paciente.service";
import { IApiResponse } from "src/common/interface/api-response.interface";


@Controller('paciente')
export class PacienteController {

    constructor(
        private pacienteService: PacienteService
    ){}

    @Get()
    async getPacientes(): Promise<IApiResponse> {
        const data = await this.pacienteService.findAll();
        return {
            statusCode: HttpStatus.OK,
            message: 'Lista de pacientes',
            data
        };
    }

    @Get(':id')
    async getPacienteById(@Param('id') id: string) {
        const data = await this.pacienteService.findOne(id);
        return {
            statusCode: HttpStatus.OK,
            message: 'Detalles del paciente',
            data
        };
    }

    @Post()
    async createPaciente(@Body() createPacienteDto: CreatePacienteDto) {
        const data = await this.pacienteService.create(createPacienteDto);
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Paciente creado',
            data
        };
    }

    @Put(':id')
    async updatePaciente(@Param('id') id: string, @Body() updatePacienteDto: UpdatePacienteDto) {
        await this.pacienteService.update(id, updatePacienteDto);
        return {
            statusCode: HttpStatus.OK,
            message: 'Paciente actualizado',
            data: null
        };
    }

}