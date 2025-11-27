import { Body, Controller, Get, HttpStatus, NotFoundException, Param, Post, Put, UseGuards } from "@nestjs/common";
import { IApiResponse } from "src/common/interface/api-response.interface";
import { LaboratorioService } from "../services/laboratorio.service";

import { CreateLaboratorioDto } from "../dto/create-laboratorio.dto";
import { PacienteService } from "@/modules/paciente/services/paciente.service";
// import { AuthGuard } from "@nestjs/passport";


@Controller('laboratorio')
export class LaboratorioController {

    constructor(
        private laboratorioService: LaboratorioService,
        private pacienteService: PacienteService
    ){}

    @Post()
    async createLaboratorio(@Body() dto: CreateLaboratorioDto): Promise<IApiResponse> {
        const paciente = await this.pacienteService.findOne(dto.idPaciente);
        if (!paciente) throw new NotFoundException('Paciente no encontrado');

        const tipo_control = await this.laboratorioService.getTipoControlById(dto.idTipoControl);
        if (!tipo_control) throw new NotFoundException('Tipo de control no encontrado');

        const tipo_laboratorio = await this.laboratorioService.getTipoLaboratorioById(dto.idTipoLaboratorio);
        if (!tipo_laboratorio) throw new NotFoundException('Tipo de laboratorio no encontrado');

        const tipo_resultado = await this.laboratorioService.getTipoResultadoById(dto.idTipoResultado);
        if (!tipo_resultado) throw new NotFoundException('Tipo de resultado no encontrado');

        const data = await this.laboratorioService.createLaboratorio(
            dto, paciente, tipo_control, tipo_laboratorio, tipo_resultado
        );

        return {
            statusCode: HttpStatus.CREATED,
            message: 'Laboratorio registrado correctamente',
            data,
            error: null
        };
    }

    // @UseGuards(AuthGuard('jwt'))
    @Get()
    async getLaboratorios(): Promise<IApiResponse> {
        let data = await this.laboratorioService.getLaboratorios();
        data = data.map(lab => ({
            ...lab,
            tipoContro: lab.tipo_control,
            tipoLaboratorio: lab.tipo_laboratorio,
            tipoResultado: lab.tipo_resultado,
            paciente: lab.paciente,
        }));

        return {
            statusCode: HttpStatus.OK,
            message: 'Lista de laboratorios',
            data,
            error: null
        };
    }

    @Get('paciente/:idPaciente')
    async getLaboratoriosPaciente(@Param('idPaciente') idPaciente: string): Promise<IApiResponse> {
        const data = await this.laboratorioService.getLaboratoriosByPaciente(idPaciente);
        return {
            statusCode: HttpStatus.OK,
            message: 'Lista de laboratorios del paciente',
            data,
            error: null
        };
    }

    @Get('tipos-control')
    async getTiposControl(): Promise<IApiResponse> {
        const data = await this.laboratorioService.getTiposControl();
        return {
            statusCode: HttpStatus.OK,
            message: 'Lista de tipos de control',
            data,
            error: null
        };
    }

    @Get('tipos-laboratorio')
    async getTiposLaboratorio(): Promise<IApiResponse> {
        const data = await this.laboratorioService.getTiposLaboratorio();
        return {
            statusCode: HttpStatus.OK,
            message: 'Lista de tipos de laboratorio',
            data,
            error: null
        };
    }

    @Get('tipos-resultado/:idTipoLaboratorio')
    async getTiposResultado(@Param('idTipoLaboratorio') idTipoLaboratorio: string): Promise<IApiResponse> {
        const data = await this.laboratorioService.getTiposResultadoByTipoLaboratorio(idTipoLaboratorio);
        return {
            statusCode: HttpStatus.OK,
            message: 'Lista de tipos de resultado',
            data,
            error: null
        };
    }
}