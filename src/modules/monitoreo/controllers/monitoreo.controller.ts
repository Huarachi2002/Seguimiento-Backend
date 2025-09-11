import { Controller, Get, Query } from "@nestjs/common";
import { MonitoreoService } from "../services/monitoreo.service";


@Controller('monitoreo')
export class MonitoreoController {

    constructor(private readonly monitoreoService: MonitoreoService) {}

    @Get('riesgo-abandono')
    async getPacientesEnRiesgo(
       @Query('dias') dias: number // Días sin asistir (default: 7)
    ) {
        //return await this.monitoreoService.getPacientesEnRiesgoAbandonoTratamiento(dias);
    }

    @Get('abandonados')
    async getPacientesAbandonados(
         @Query('dias') dias: number // Días para considerar abandono (default: 30)
    ){
        //return await this.monitoreoService.getPacientesAbandonados(dias);
    }

    @Get('citas-perdidas')
    async getCitasPerdidas(
        @Query('fechaInicio') fechaInicio: string, // Fecha de inicio en formato ISO
        @Query('fechaFin') fechaFin: string // Fecha de fin en formato ISO
    ) {
        //return await this.monitoreoService.getCitasPerdidas(fechaInicio, fechaFin);
    }

    @Get('adherencia/:idPaciente')
    async getAdherenciaPaciente(@Query('idPaciente') idPaciente: string) {
        //return await this.monitoreoService.getEstadisticasAdherencia(idPaciente);
    }



}