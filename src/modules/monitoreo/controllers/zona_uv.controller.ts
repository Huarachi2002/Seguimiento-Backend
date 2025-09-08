import { Body, Controller, Get, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { IApiResponse } from "src/common/interface/api-response.interface";
import { ZonaService } from "../services/zona.service";
import { CreateZonaUvDto } from "../dto/create-zona-uv.dto";
import { UpdateZonaUvDto } from "../dto/update-zona-uv.dto";


@Controller('zona-uv')
export class ZonaUvController {

    constructor(
        private readonly zonaUvService: ZonaService
    ){}

    @Get()
    getAllZonaUvs(): Promise<IApiResponse> {
        return this.zonaUvService.findAllUvs().then(data => ({
            statusCode: HttpStatus.OK,
            message: 'Lista de zonas UV',
            data
        }));
    }

    @Get(':id')
    getZonaUvById(@Param('id') id: string) {
        return this.zonaUvService.findUvById(id).then(data => ({
            statusCode: HttpStatus.OK,
            message: 'Detalles de la zona UV',
            data
        }));
    }

    @Post()
    createZonaUv(@Body() createZonaUvDto: CreateZonaUvDto): Promise<IApiResponse> {
        return this.zonaUvService.createUv(createZonaUvDto).then(data => ({
            statusCode: HttpStatus.CREATED,
            message: 'Zona UV creada',
            data
        }));
    }

    @Put(':id')
    updateZonaUv(@Param('id') id: string, @Body() updateZonaUvDto: UpdateZonaUvDto): Promise<IApiResponse> {
        return this.zonaUvService.updateUv(id, updateZonaUvDto).then(() => ({
            statusCode: HttpStatus.OK,
            message: 'Zona UV actualizada',
            data: null
        }));
    }

}