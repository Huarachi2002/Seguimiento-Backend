import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { MonitoreoService } from "../services/monitoreo.service";
import { IApiResponse } from "@/common/interface/api-response.interface";
import { TratamientoTB } from "@/modules/tratamiento/entities/tratamientoTB.entity";
import { IncidenciaTbDto } from "../dto/incidencia-tb.dto";


@Controller('monitoreo')
export class MonitoreoController {

    constructor(private readonly monitoreoService: MonitoreoService) {}

    @Get('riesgo-abandono')
    async getPacientesEnRiesgo(
       @Query('dias') dias: number = 1 // Días sin asistir (default: 1)
    ):Promise<IApiResponse> {
        const data = await this.monitoreoService.getPacientesEnRiesgoAbandonoTratamiento(dias);
        return {
            statusCode: 200,
            message: 'Lista de pacientes en riesgo de abandono',
            data
        };
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

    @Get('pacientes-citas')
    async getPacientesConCitasPendientes():Promise<IApiResponse> {
        const tratamientos: TratamientoTB[] = await this.monitoreoService.getPacientesConCitasPendientes();
        const data = tratamientos.map(tratamiento => ({
            idTratamiento: tratamiento.id,
            fecha_programada: new Date(),
            fecha_acumulada: new Date(),
            tratamiento: tratamiento
        }));

        return {
            statusCode: 200,
            message: 'Lista de pacientes con citas pendientes',
            data
        };
    }

    @Post('pacientes-nuevos')
    async getPacientesNuevos(
        @Body() fechas: { fechaInicio: Date; fechaFin: Date }
    ):Promise<IApiResponse> {
        const data = await this.monitoreoService.getPacientesNuevos(fechas.fechaInicio, fechas.fechaFin);
        return {
            statusCode: 200,
            message: 'Lista de pacientes nuevos',
            data
        };
    }

    @Get('mapa-calor')
    async getMapaCalorPacientes():Promise<IApiResponse> {
        const data = await this.monitoreoService.getMapaCalorPacientes();
        return {
            statusCode: 200,
            message: 'Mapa de calor de pacientes',
            data
        };
    }

    @Get('indicadores-evaluacion')
    async getIndicadoresEvaluacion():Promise<IApiResponse> {
        const dataTbTSF = await this.monitoreoService.getIndicadoresEvaluacionTbTSF();
        const dataTbP = await this.monitoreoService.getIndicadoresEvaluacionTbP();
        const dataFallecidosTbTSF = await this.monitoreoService.getFallecidosTbTSF();
        const dataTbMeningeaNinos = await this.monitoreoService.getIndicadoresEvaluacionTbMeningeaNinos();

        const totalPoblacion = 100000; // TODO: Obtener la población total del año
        
        const tasaIncidenciaTbTSF: IncidenciaTbDto = {
            descripcion: 'Incidencia de TB TSF',
            valor: Math.round((dataTbTSF.length / totalPoblacion) * 100000)
        };
        const tasaIncidenciaTbP: IncidenciaTbDto = {
            descripcion: 'Incidencia de TB Pulmonar',
            valor: Math.round((dataTbP.length / totalPoblacion) * 100000)
        };
        const tasaMortalidadTbTSF: IncidenciaTbDto = {
            descripcion: 'Mortalidad por TB TSF',
            valor: Math.round((dataFallecidosTbTSF.length / totalPoblacion) * 100000)
        };
        const tasaIncidenciaTbMeningeaNinos: IncidenciaTbDto = {
            descripcion: 'Incidencia de TB Meningea en Niños',
            valor: Math.round((dataTbMeningeaNinos.length / totalPoblacion) * 100000)
        };

        return {
            statusCode: 200,
            message: 'Lista de indicadores de evaluación',
            data: [
                tasaIncidenciaTbTSF,
                tasaIncidenciaTbP,
                tasaMortalidadTbTSF,
                tasaIncidenciaTbMeningeaNinos
            ]
        };
    }

}