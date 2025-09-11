import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { TratamientoService } from "../services/tratamiento.service";
import { IApiResponse } from "src/common/interface/api-response.interface";
import { CitaService } from "../services/cita.service";
import { CreateCitaDto } from "../dto/create-cita.dto";
import { UserService } from "../services/user.service";
import { UpdateCitaDto } from "../dto/update-cita.dto";
import { CreateTipoCitaDto } from "../dto/create-tipo-cita.dto";
import { CreateEstadoCitaDto } from "../dto/create-estado-cita.dto";
import { UpdateTipoCitaDto } from "../dto/update-tipo-cita.dto";
import { UpdateEstadoCitaDto } from "../dto/update-estado-cita.dto";


@Controller('cita')
export class CitaController {

    constructor(
        private citaService: CitaService,
        private tratamientoService: TratamientoService,
        private usuarioService: UserService,
    ){}

    @Get('paciente/:idPaciente')
    async getCitasByPaciente(@Param('idPaciente') idPaciente: string):Promise<IApiResponse>{
        const data = await this.citaService.findByPaciente(idPaciente);
        return {
            statusCode: 200,
            message: 'Lista de citas del paciente',
            data
        };
    }
    
    @Get('tratamiento/:idTratamiento')
    async getCitasByTratamiento(@Param('idTratamiento') idTratamiento: string):Promise<IApiResponse>{
        const data = await this.citaService.findByTratamiento(idTratamiento);
        return {
            statusCode: 200,
            message: 'Lista de citas del tratamiento',
            data
        };
    }

    @Get('estado-cita')
    async getEstadosCita():Promise<IApiResponse>{
        const data = await this.citaService.getEstadosCita();
        return {
            statusCode: 200,
            message: 'Lista de estados de cita',
            data
        };
    }

    @Get('estado-cita/:id')
    async getEstadoCitaById(@Param('id') id: string):Promise<IApiResponse>{
        const data = await this.citaService.getEstadoCitaById(id);
        return {
            statusCode: 200,
            message: 'Estado de cita encontrado',
            data
        };
    }

    @Get('tipo-cita')
    async getTiposCita():Promise<IApiResponse>{
        const data = await this.citaService.getTiposCita();
        return {
            statusCode: 200,
            message: 'Lista de tipos de cita',
            data
        };
    }

    @Get('tipo-cita/:id')
    async getTipoCitaById(@Param('id') id: string):Promise<IApiResponse>{
        const data = await this.citaService.getTipoCitaById(id);
        return {
            statusCode: 200,
            message: 'Tipo de cita encontrado',
            data
        };
    }

    @Post()
    async createCita(@Body() citaDto: CreateCitaDto):Promise<IApiResponse>{
        const { idEstado, idTipo, idTratamiento, idUser } = citaDto;
        const tratamiento = await this.tratamientoService.findOne(idTratamiento);
        if(!tratamiento){
            throw new Error('Tratamiento no encontrado');
        }
        const estado = await this.tratamientoService.getEstadoTratamientoById(idEstado);
        if(!estado){
            throw new Error('Estado no encontrado');
        }
        const tipo = await this.tratamientoService.getTipoTratamientoById(idTipo);
        if(!tipo){
            throw new Error('Tipo de cita no encontrado');
        }
        const usuario = await this.usuarioService.findOne(idUser);
        if(!usuario){
            throw new Error('Usuario no encontrado');
        }
        const data = await this.citaService.create(citaDto, tratamiento, tipo, estado, usuario);
        return {
            statusCode: 201,
            message: 'Cita creada exitosamente',
            data
        };
    }

    @Post('tipo-cita')
    async createTipoCita(@Body() createTipoCitaDto: CreateTipoCitaDto):Promise<IApiResponse>{
        const tipoCita = await this.citaService.createTipoCita(createTipoCitaDto);
        return {
            statusCode: 201,
            message: 'Tipo de cita creado exitosamente',
            data: tipoCita
        };
    }

    @Post('estado-cita')
    async createEstadoCita(@Body() createEstadoCitaDto: CreateEstadoCitaDto):Promise<IApiResponse>{
        const estadoCita = await this.citaService.createEstadoCita(createEstadoCitaDto);
        return {
            statusCode: 201,
            message: 'Estado de cita creado exitosamente',
            data: estadoCita
        };
    }
    
    @Put('tipo-cita/:id')
    async updateTipoCita(@Param('id') id: string, @Body() tipoCitaDto: UpdateTipoCitaDto):Promise<IApiResponse>{
        const data = await this.citaService.updateTipoCita(id, tipoCitaDto);
        return {
            statusCode: 200,
            message: 'Tipo de cita actualizado exitosamente',
            data
        };
    }

    @Put('estado-cita/:id')
    async updateEstadoCita(@Param('id') id: string, @Body() estadoCitaDto: UpdateEstadoCitaDto):Promise<IApiResponse>{
        const data = await this.citaService.updateEstadoCita(id, estadoCitaDto);
        return {
            statusCode: 200,
            message: 'Estado de cita actualizado exitosamente',
            data
        };
    }

    @Put(':id')
    async updateCita(@Param('id') id: string, @Body() citaDto: UpdateCitaDto):Promise<IApiResponse>{
        const { idEstado, idTipo, idTratamiento, idUser } = citaDto;
        const tratamiento = await this.tratamientoService.findOne(idTratamiento);
        if(!tratamiento){
            throw new Error('Tratamiento no encontrado');
        }
        const estado = await this.tratamientoService.getEstadoTratamientoById(idEstado);
        if(!estado){
            throw new Error('Estado no encontrado');
        }
        const tipo = await this.tratamientoService.getTipoTratamientoById(idTipo);
        if(!tipo){
            throw new Error('Tipo de cita no encontrado');
        }
        const usuario = await this.usuarioService.findOne(idUser);
        if(!usuario){
            throw new Error('Usuario no encontrado');
        }
        const data = await this.citaService.update(id, citaDto, tratamiento, tipo, estado, usuario);
        return {
            statusCode: 200,
            message: 'Cita actualizada exitosamente',
            data
        };
    }
}