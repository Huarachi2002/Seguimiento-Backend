import { Body, Controller, Get, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { IApiResponse } from "src/common/interface/api-response.interface";
import { DireccionService } from "../services/direccion.service";
import { CreateDireccionDto } from "../dto/create-direccion.dto";
import { UpdateDireccionDto } from "../dto/update-direccion.dto";
import { CreateZonaMzaDto } from "../dto/create-zona-mza.dto";
import { CreateZonaUvDto } from "../dto/create-zona-uv.dto";


@Controller('direccion')
export class DireccionController {

    constructor(
        private direccionService: DireccionService
    ){}

    @Get('zona-mza')
    async getAllZonaMzas(): Promise<IApiResponse> {
        const data = await this.direccionService.findAllMzas();
        return {
            statusCode: HttpStatus.OK,
            message: 'Lista de zonas Mza',
            data
        };
    }

    @Get('zona-uv')
    async getAllZonaUvs(): Promise<IApiResponse> {
        const data = await this.direccionService.findAllUvs();
        return {
            statusCode: HttpStatus.OK,
            message: 'Lista de zonas UV',
            data
        };
    }

    @Get('zona-mza/:id')
    async getZonaMzaById(@Param('id') id: string): Promise<IApiResponse> {
        const data = await this.direccionService.findMzaById(id);
        if (!data) {
            return {
                statusCode: HttpStatus.NOT_FOUND,
                message: 'Zona Mza no encontrada',
                data: null
            };
        }
        return {
            statusCode: HttpStatus.OK,
            message: 'Detalles de la zona Mza',
            data
        };
    }

    @Get('zona-uv/:id')
    async getZonaUvById(@Param('id') id: string): Promise<IApiResponse> {
        const data = await this.direccionService.findUvById(id);
        if (!data) {
            return {
                statusCode: HttpStatus.NOT_FOUND,
                message: 'Zona UV no encontrada',
                data: null
            };
        }
        return {
            statusCode: HttpStatus.OK,
            message: 'Detalles de la zona UV',
            data
        };
    }

    @Get('zona-mza/uv/:idZonaUv')
    getZonasMzaByZonaUv(@Param('idZonaUv') idZonaUv: string) {
        return this.direccionService.findMzasByZonaUv(idZonaUv).then(data => ({
            statusCode: HttpStatus.OK,
            message: 'Lista de zonas Mza por Zona UV',
            data
        }));
    }

    @Get('paciente/:idPaciente')
    getDirrecionByPaciente(@Param('idPaciente') id: string) {
        const paciente = this.direccionService.findPacienteById(id)
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

    @Get(':id')
    async getDireccionById(@Param('id') id: string): Promise<IApiResponse> {
        const data = await this.direccionService.findOne(id);
        if(!data){
            return {
                statusCode: 404,
                message: "Direccion no encontrada",
                data: null
            };
        }
        return {
            statusCode: HttpStatus.OK,
            message: 'Detalles de la direccion',
            data
        };
    }

    

    @Post('zona-mza')
    async createZonaMza(@Body() createZonaMzaDto: CreateZonaMzaDto): Promise<IApiResponse> {
        const zona_uv = await this.direccionService.findUvById(createZonaMzaDto.idZonaUv);
        if (!zona_uv) {
            return {
                statusCode: HttpStatus.NOT_FOUND,
                message: 'Zona UV no encontrada',
                data: null
            };
        }
        
        const data = await this.direccionService.createMza(createZonaMzaDto, zona_uv);
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Zona Mza creada',
            data
        };
    }

    @Post('zona-uv')
    async createZonaUv(@Body() createZonaUvDto: CreateZonaUvDto): Promise<IApiResponse> {
        const data = await this.direccionService.createUv(createZonaUvDto);
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Zona UV creada',
            data
        };
    }

    @Post()
    async createDireccion(@Body() createDireccionDto: CreateDireccionDto): Promise<IApiResponse> {
        const paciente = await this.direccionService.findPacienteById(createDireccionDto.idPaciente);
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

    @Put('zona-mza/:id')
    async updateZonaMza(@Param('id') id: string, @Body() updateZonaMzaDto: CreateZonaMzaDto): Promise<IApiResponse> {
        const zonaUv = await this.direccionService.findUvById(updateZonaMzaDto.idZonaUv);
        if (!zonaUv) {
            return {
                statusCode: HttpStatus.NOT_FOUND,
                message: 'Zona UV no encontrada',
                data: null
            };
        }
        const data = await this.direccionService.updateMza(id, updateZonaMzaDto, zonaUv);
        return {
            statusCode: HttpStatus.OK,
            message: 'Zona Mza actualizada',
            data
        };
    }

    @Put('zona-uv/:id')
    async updateZonaUv(@Param('id') id: string, @Body() updateZonaUvDto: CreateZonaUvDto): Promise<IApiResponse> {
        const data = await this.direccionService.updateUv(id, updateZonaUvDto);
        return {
            statusCode: HttpStatus.OK,
            message: 'Zona UV actualizada',
            data
        };
    }

    @Put(':id')
    async updateDireccion(@Param('id') id: string, @Body() updateDireccionDto: UpdateDireccionDto): Promise<IApiResponse> {
        const data = await this.direccionService.update(id, updateDireccionDto);
        if(!data){
            return {
                statusCode: 404,
                message: "Direccion no encontrada",
                data: null
            };
        }
        return {
            statusCode: HttpStatus.OK,
            message: 'Direccion actualizada',
            data
        };
    }

}