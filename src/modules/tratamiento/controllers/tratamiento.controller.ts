import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { TratamientoService } from "../services/tratamiento.service";
import { IApiResponse } from "src/common/interface/api-response.interface";
import { PacienteService } from "src/modules/paciente/services/paciente.service";
import { CreateTratamientoDto } from "../dto/create-tratamiento.dto";
import { UpdateTratamientoDto } from "../dto/update-tratamiento.dto";
import { CreateTipoTratamientoDto } from "../dto/create-tipo-tratamiento.dto";
import { CreateEstadoTratamientoDto } from "../dto/create-estado-tratamiento.dto";
import { UpdateTipoTratamientoDto } from "../dto/update-tipo-tratamiento.dto";
import { UpdateEstadoTratamientoDto } from "../dto/update-estado-tratamiento.dto";


@Controller('tratamiento')
export class TratamientoController {

    constructor(
        private tratamientoService: TratamientoService,
        private pacienteService: PacienteService,
    ){}

    @Get('tipo-tratamiento')
    async getTiposTratamiento():Promise<IApiResponse>{
        const data = await this.tratamientoService.getTiposTratamiento();
        return {
            statusCode: 200,
            message: 'Lista de tipos de tratamiento',
            data
        };
    }

    @Get('estado-tratamiento')
    async getEstadosTratamiento():Promise<IApiResponse>{
        const data = await this.tratamientoService.getEstadosTratamiento();
        return {
            statusCode: 200,
            message: 'Lista de estados de tratamiento',
            data
        };
    }

    @Get('fase-tratamiento')
    async getFasesTratamiento():Promise<IApiResponse>{
        const data = await this.tratamientoService.getFasesTratamiento();
        return {
            statusCode: 200,
            message: 'Lista de fases de tratamiento',
            data
        };
    }

    @Get('localizaciones')
    async getLocalizaciones(): Promise<IApiResponse> {
        const data = await this.tratamientoService.getLocalizaciones();
        return {
            statusCode: 200,
            message: 'Lista de localizaciones TB',
            data
        };
    }

    @Get('paciente/:idPaciente')
    async getTratamientosByPaciente(@Param('idPaciente') idPaciente: string):Promise<IApiResponse>{
        const paciente = await this.pacienteService.findOne(idPaciente);
        if(!paciente){
            return {
                statusCode: 404,
                message: 'Paciente no encontrado',
                data: null
            };
        }
        const data = await this.tratamientoService.findByPaciente(idPaciente);
        return {
            statusCode: 200,
            message: 'Lista de tratamientos del paciente',
            data
        };
    }

    @Get(':id')
    async getTratamientoById(@Param('id') id: string):Promise<IApiResponse>{
        const data = await this.tratamientoService.findOne(id);
        if(!data){
            return {
                statusCode: 404,
                message: 'Tratamiento no encontrado',
                data: null
            }
        }
        return {
            statusCode: 200,
            message: 'Tratamiento encontrado',
            data
        };
    }

    @Get('tipo-tratamiento/:id')
    async getTipoTratamientoById(@Param('id') id: string):Promise<IApiResponse>{
        const data = await this.tratamientoService.getTipoTratamientoById(id);
        if(!data){
            return {
                statusCode: 404,
                message: 'Tipo de tratamiento no encontrado',
                data: null
            };
        }
        return {
            statusCode: 200,
            message: 'Tipo de tratamiento encontrado',
            data
        };
    }

    @Get('estado-tratamiento/:id')
    async getEstadoTratamientoById(@Param('id') id: string):Promise<IApiResponse>{
        const data = await this.tratamientoService.getEstadoTratamientoById(id);
        if(!data){
            return {
                statusCode: 404,
                message: 'Estado de tratamiento no encontrado',
                data: null
            };
        }
        return {
            statusCode: 200,
            message: 'Estado de tratamiento encontrado',
            data
        };
    }

    @Get()
    async getAllTratamientos():Promise<IApiResponse>{
        const data = await this.tratamientoService.findAll();
        return {
            statusCode: 200,
            message: 'Lista de tratamientos',
            data
        };
    }

    @Post('tipo-tratamiento')
    async createTipoTratamiento(@Body() createTipoTratamientoDto: CreateTipoTratamientoDto):Promise<IApiResponse>{
        
        const tipoTratamiento = await this.tratamientoService.createTipoTratamiento(createTipoTratamientoDto);
        return {
            statusCode: 201,
            message: 'Tipo de tratamiento creado exitosamente',
            data: tipoTratamiento
        };
    }

    @Post('estado-tratamiento')
    async createEstadoTratamiento(@Body() createEstadoTratamientoDto: CreateEstadoTratamientoDto):Promise<IApiResponse>{

        const estadoTratamiento = await this.tratamientoService.createEstadoTratamiento(createEstadoTratamientoDto);
        return {
            statusCode: 201,
            message: 'Estado de tratamiento creado exitosamente',
            data: estadoTratamiento
        };
    }


    @Post()
    async create(@Body() createTratamientoDto: CreateTratamientoDto):Promise<IApiResponse>{
        const paciente = await this.pacienteService.findOne(createTratamientoDto.idPaciente);
        if(!paciente){
            return {
                statusCode: 404,
                message: 'Paciente no encontrado',
                data: null
            };
        }

        const tipoTratamiento = await this.tratamientoService.getTipoTratamientoById(createTratamientoDto.idTipoTratamiento);
        if(!tipoTratamiento){
            return {
                statusCode: 404,
                message: 'Tipo de tratamiento no encontrado',
                data: null
            };
        }

        const estadoTratamiento = await this.tratamientoService.getEstadoTratamientoById(createTratamientoDto.idEstado);
        if(!estadoTratamiento){
            return {
                statusCode: 404,
                message: 'Estado de tratamiento no encontrado',
                data: null
            };
        }

        const localizacionTb = await this.tratamientoService.getLocalizacionById(createTratamientoDto.idLocalizacionTb);
        if(!localizacionTb){
            return {
                statusCode: 404,
                message: 'Estado de tratamiento no encontrado',
                data: null
            };
        }

        const tratamiento = await this.tratamientoService.create(createTratamientoDto, tipoTratamiento, estadoTratamiento, localizacionTb, paciente);
        return {
            statusCode: 201,
            message: 'Tratamiento creado exitosamente',
            data: tratamiento
        };
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateTratamientoDto: UpdateTratamientoDto): Promise<IApiResponse> {
        const paciente = await this.pacienteService.findOne(updateTratamientoDto.idPaciente);
        if(!paciente){
            return {
                statusCode: 404,
                message: 'Paciente no encontrado',
                data: null
            };
        }

        const tipoTratamiento = await this.tratamientoService.getTipoTratamientoById(updateTratamientoDto.idTipoTratamiento);
        if(!tipoTratamiento){
            return {
                statusCode: 404,
                message: 'Tipo de tratamiento no encontrado',
                data: null
            };
        }

        const estadoTratamiento = await this.tratamientoService.getEstadoTratamientoById(updateTratamientoDto.idEstado);
        if(!estadoTratamiento){
            return {
                statusCode: 404,
                message: 'Estado de tratamiento no encontrado',
                data: null
            };
        }

        const updatedTratamiento = await this.tratamientoService.update(id, updateTratamientoDto, tipoTratamiento, estadoTratamiento);
        return {
            statusCode: 200,
            message: 'Tratamiento actualizado exitosamente',
            data: updatedTratamiento
        };
    }

    @Put('tipo-tratamiento/:id')
    async updateTipoTratamiento(@Param('id') id: string, @Body() updateTipoTratamientoDto: UpdateTipoTratamientoDto):Promise<IApiResponse>{
        const updatedTipo = await this.tratamientoService.updateTipoTratamiento(id, updateTipoTratamientoDto);
        return {
            statusCode: 200,
            message: 'Tipo de tratamiento actualizado exitosamente',
            data: updatedTipo
        };
    }

    @Put('estado-tratamiento/:id')
    async updateEstadoTratamiento(@Param('id') id: string, @Body() updateEstadoTratamientoDto: UpdateEstadoTratamientoDto):Promise<IApiResponse>{
        const updatedEstado = await this.tratamientoService.updateEstadoTratamiento(id, updateEstadoTratamientoDto);
        return {
            statusCode: 200,
            message: 'Estado de tratamiento actualizado exitosamente',
            data: updatedEstado
        };
    }
}