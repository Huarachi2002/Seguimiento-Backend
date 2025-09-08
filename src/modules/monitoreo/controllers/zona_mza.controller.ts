import { Body, Controller, Get, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { IApiResponse } from "src/common/interface/api-response.interface";
import { ZonaService } from "../../monitoreo/services/zona.service";
import { CreateZonaMzaDto } from "../dto/create-zona-mza.dto";
import { UpdateZonaMzaDto } from "../dto/update-zona-mza.dto";


@Controller('zona-mza')
export class ZonaMzaController {

    constructor(
        private zonaMzaService: ZonaService
    ){}

    @Get()
    getAllZonaMzas(): Promise<IApiResponse> {
        return this.zonaMzaService.findAllMzas().then(data => ({
            statusCode: HttpStatus.OK,
            message: 'Lista de zonas Mza',
            data
        }));
    }

    @Get(':id')
    getZonaMzaById(@Param('id') id: string): Promise<IApiResponse> {
        return this.zonaMzaService.findMzaById(id).then(data => ({
            statusCode: HttpStatus.OK,
            message: 'Detalles de la zona Mza',
            data
        }));
    }

    @Post()
    async createZonaMza(@Body() createZonaMzaDto: CreateZonaMzaDto): Promise<IApiResponse> {
        const zonaUv = await this.zonaMzaService.findUvById(createZonaMzaDto.idZonaUv);
        if (!zonaUv) {
            return Promise.resolve({
                statusCode: HttpStatus.NOT_FOUND,
                message: 'Zona UV no encontrada',
                data: null
            });
        }
        return this.zonaMzaService.createMza(createZonaMzaDto, zonaUv).then(data => ({
            statusCode: HttpStatus.CREATED,
            message: 'Zona Mza creada',
            data
        }));
    }

    @Put(':id')
    async updateZonaMza(@Param('id') id: string, @Body() updateZonaMzaDto: UpdateZonaMzaDto): Promise<IApiResponse> {
        const zonaUv = await this.zonaMzaService.findUvById(updateZonaMzaDto.idZonaUv);
        if (!zonaUv) {
            return Promise.resolve({
                statusCode: HttpStatus.NOT_FOUND,
                message: 'Zona UV no encontrada',
                data: null
            });
        }
        return this.zonaMzaService.updateMza(id, updateZonaMzaDto, zonaUv).then(() => ({
            statusCode: HttpStatus.OK,
            message: 'Zona Mza actualizada',
            data: null
        }));
    }

}