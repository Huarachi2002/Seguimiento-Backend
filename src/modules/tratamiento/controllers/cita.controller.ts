import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { TratamientoService } from "../services/tratamiento.service";
import { IApiResponse } from "src/common/interface/api-response.interface";
import { CitaService } from "../services/cita.service";
import { CreateCitaDto } from "../dto/create-cita.dto";
import { UserService } from "../services/user.service";
import { UpdateCitaDto } from "../dto/update-cita.dto";
import { CreateTipoCitaDto } from "../dto/create-tipo-cita.dto";
import { CreateEstadoCitaDto } from "../dto/create-estado-cita.dto";
import { CreateMotivoDto } from "../dto/create-motivo.dto";
import { UpdateMotivoDto } from "../dto/update-motivo.dto";
import { UpdateTipoCitaDto } from "../dto/update-tipo-cita.dto";
import { UpdateEstadoCitaDto } from "../dto/update-estado-cita.dto";
import { UpdateAssistantDto } from "../dto/update-cita-assistant.dto";


@Controller('cita')
export class CitaController {

    constructor(
        private citaService: CitaService,
        private tratamientoService: TratamientoService,
        private usuarioService: UserService,
    ){}

    @Get('estado-cita')
    async getEstadosCita():Promise<IApiResponse>{
        const data = await this.citaService.getEstadosCita();
        return {
            statusCode: 200,
            message: 'Lista de estados de cita',
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

    @Get('motivo')
    async getMotivos():Promise<IApiResponse>{
        const data = await this.citaService.getMotivos();
        return {
            statusCode: 200,
            message: 'Lista de motivos de no asistencia',
            data
        };
    }

    @Post('motivo')
    async createMotivo(@Body() createMotivoDto: CreateMotivoDto):Promise<IApiResponse>{
        const data = await this.citaService.createMotivo(createMotivoDto);
        return {
            statusCode: 201,
            message: 'Motivo creado exitosamente',
            data
        };
    }

    @Put('motivo/:id')
    async updateMotivo(@Param('id') id: string, @Body() updateMotivoDto: UpdateMotivoDto):Promise<IApiResponse>{
        const data = await this.citaService.updateMotivo(id, updateMotivoDto);
        return {
            statusCode: 200,
            message: 'Motivo actualizado exitosamente',
            data
        };
    }

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

    @Get('estado-cita/:id')
    async getEstadoCitaById(@Param('id') id: string):Promise<IApiResponse>{
        const data = await this.citaService.getEstadoCitaById(id);
        if(!data) {
            return {
                statusCode: 404,
                message: 'Estado de cita no encontrado',
                data: null
            };
        }
        return {
            statusCode: 200,
            message: 'Estado de cita encontrado',
            data
        };
    }

    @Get('tipo-cita/:id')
    async getTipoCitaById(@Param('id') id: string):Promise<IApiResponse>{
        const data = await this.citaService.getTipoCitaById(id);
        if(!data){
            return {
                statusCode: 404,
                message: 'Tipo de cita no encontrado',
                data: null
            };
        }
        return {
            statusCode: 200,
            message: 'Tipo de cita encontrado',
            data
        };
    }

    @Get(':id')
    async getCitaById(@Param('id') id: string):Promise<IApiResponse>{
        const data = await this.citaService.findOne(id);
        if(!data){
            return {
                statusCode: 404,
                message: 'Cita no encontrada',
                data: null
            };
        }
        return {
            statusCode: 200,
            message: 'Cita encontrada',
            data
        };
    }

    @Post()
    async createCita(@Body() citaDto: CreateCitaDto):Promise<IApiResponse>{
        const { idEstado, idTipo, idTratamiento, idMotivo, idUser } = citaDto;
        const tratamiento = await this.tratamientoService.findOne(idTratamiento);
        if(!tratamiento){
            throw new Error('Tratamiento no encontrado');
        }
        const estado = await this.citaService.getEstadoCitaById(idEstado);
        if(!estado){
            throw new Error('Estado no encontrado');
        }
        const tipo = await this.citaService.getTipoCitaById(idTipo);
        if(!tipo){
            throw new Error('Tipo de cita no encontrado');
        }
        // const usuario = await this.usuarioService.findOne(idUser);
        // if(!usuario){
        //     throw new Error('Usuario no encontrado');
        // }
        // const data = await this.citaService.create(citaDto, tratamiento, tipo, estado, usuario);
        var motivo = null
        if (estado.descripcion == "Perdido") {
            motivo = await this.citaService.getMotivoById(idMotivo);
        }

        const data = await this.citaService.create(citaDto, tratamiento, tipo, estado, motivo, null);
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

    @Put('update-assistant')
    async updateCitaAssistant(@Body() updateAssistantDto: UpdateAssistantDto):Promise<IApiResponse>{
        const citas = await this.citaService.findByPaciente(updateAssistantDto.id_paciente);
        if(citas.length === 0){
            throw new Error('No se encontraron citas para el paciente');
        }

        const userAdmin = await this.usuarioService.getUserAdmin()

        const estadoCita = await this.citaService.getEstadoCitaByDescription('Reprogramado');

        const fechaProgramada = new Date(updateAssistantDto.fecha_programada);

        if (isNaN(fechaProgramada.getTime())) {
            throw new Error('Fecha programada inválida');
        }

        const observacion = updateAssistantDto.motivo;

        const ultimaCita = citas[citas.length - 1];

        const assistant = await this.citaService.updateCitaAssistant(
            ultimaCita.id, 
            fechaProgramada, 
            observacion, 
            userAdmin, 
            estadoCita
        );
        return {
            statusCode: 201,
            message: 'Cita actualizada exitosamente',
            data: assistant
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
        const estado = await this.citaService.getEstadoCitaById(idEstado);
        if(!estado){
            throw new Error('Estado no encontrado');
        }
        const tipo = await this.citaService.getTipoCitaById(idTipo);
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