import { Motivo } from "@/modules/tratamiento/entities/motivo.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Paciente } from "src/modules/paciente/entities/paciente.entity";
import { Cita } from "src/modules/tratamiento/entities/cita.entity";
import { TratamientoTB } from "src/modules/tratamiento/entities/tratamientoTB.entity";
import { Repository } from "typeorm";


@Injectable()
export class MonitoreoService {
    constructor(
        @InjectRepository(Paciente) private pacienteRepository: Repository<Paciente>,
        @InjectRepository(Cita) private citaRepository: Repository<Cita>,
        @InjectRepository(TratamientoTB) private tratamientoRepository: Repository<TratamientoTB>,
        @InjectRepository(Motivo) private motivoRepository: Repository<Motivo>,
    ) {}

    // Pacientes en riesgo de abandono
    async getPacientesEnRiesgoAbandonoTratamiento(diasPeriodo: number = 30){
        const fechaFin = new Date();
        const fechaInicio = new Date();
        fechaInicio.setDate(fechaFin.getDate() - diasPeriodo);

        const tratamientos = await this.tratamientoRepository.createQueryBuilder('tratamiento')
            .innerJoinAndSelect('tratamiento.paciente', 'paciente')
            .innerJoinAndSelect('tratamiento.citas', 'cita')
            .innerJoin('tratamiento.estado', 'estado_tratamiento')
            .leftJoinAndSelect('cita.estado', 'estado_cita')
            .where('estado_tratamiento.descripcion = :estadoTratamiento', { estadoTratamiento: 'En Curso' })
            .andWhere('cita.fecha_programada BETWEEN :fechaInicio AND :fechaFin', { fechaInicio, fechaFin })
            .getMany();

        const reporte = tratamientos.map(tratamiento => {
            const citas = tratamiento.citas.sort((a, b) => new Date(a.fecha_programada).getTime() - new Date(b.fecha_programada).getTime());
            
            const T = diasPeriodo;
            const citasPerdidas = citas.filter(c => c.estado && c.estado.descripcion === 'Perdido');
            const M = citasPerdidas.length;
            
            if (M === 0) return null;

            let missRuns = 0;
            let maxRunLength = 0;
            let currentRunLength = 0;
            
            const diasPerdidos = citasPerdidas.map(c => {
                const d = new Date(c.fecha_programada);
                d.setHours(0,0,0,0);
                return d.getTime();
            });

            const diasUnicos = [...new Set(diasPerdidos)].sort((a, b) => a - b);

            if (diasUnicos.length > 0) {
                missRuns = 1;
                currentRunLength = 1;
                maxRunLength = 1;

                for (let i = 1; i < diasUnicos.length; i++) {
                    const diffTime = diasUnicos[i] - diasUnicos[i-1];
                    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

                    if (diffDays === 1) {
                        currentRunLength++;
                    } else {
                        missRuns++;
                        currentRunLength = 1;
                    }
                    if (currentRunLength > maxRunLength) {
                        maxRunLength = currentRunLength;
                    }
                }
            }

            const missRate = M / T;
            const dispersionIndex = M > 0 ? missRuns / M : 0;
            const longestGapNormalized = maxRunLength / T;

            const riskScore = (0.6 * missRate) + (0.3 * dispersionIndex) + (0.1 * longestGapNormalized);

            let nivel = 'Bajo';
            if (riskScore > 0.75) nivel = 'Muy Alto';
            else if (riskScore > 0.5) nivel = 'Alto';
            else if (riskScore > 0.25) nivel = 'Moderado';

            return {
                paciente: tratamiento.paciente,
                tratamientoId: tratamiento.id,
                metricas: {
                    T,
                    M,
                    missRate: Number(missRate.toFixed(4)),
                    missRuns,
                    dispersionIndex: Number(dispersionIndex.toFixed(4)),
                    longestGapNormalized: Number(longestGapNormalized.toFixed(4)),
                    riskScore: Number(riskScore.toFixed(4)),
                    nivel
                }
            };
        }).filter(item => item !== null);

        return reporte.sort((a, b) => b.metricas.riskScore - a.metricas.riskScore);
    }

    // Pacientes que han abandonado
    async getPacientesAbandonados(diasAbandono: number) {  // TODO: Falta Analizar
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() - diasAbandono);

        return await this.tratamientoRepository
            .createQueryBuilder('tratamiento')
            .leftJoinAndSelect('tratamiento.paciente', 'paciente')
            .leftJoinAndSelect('tratamiento.citas', 'cita')
            .where('tratamiento.estado = :estado', { estado: 'Abandonado'})
            .orWhere( qb => {
                const subQuery = qb.subQuery()
                    .select('MAX(cita.fecha_programada)', 'ultimaCita')
                    .from('cita', 'cita')
                    .where('cita.tratamientoId = tratamiento.id')
                    .getQuery();
                return `cita.fecha_programada IS NULL OR cita.fecha_programada < ${subQuery}`;
            })
    }

    // Citas perdidas en un rango de fechas
    async getCitasPerdidas(fechaInicio: Date, fechaFin: Date) {  // TODO: Falta Analizar
        return await this.citaRepository.createQueryBuilder('cita')
            .leftJoinAndSelect('cita.paciente', 'paciente')
            .where('cita.fecha_programada BETWEEN :fechaInicio AND :fechaFin', { fechaInicio, fechaFin })
            .andWhere('cita.estado = :estado', { estado: 'Perdida' })
            .getMany();
    }

    // Obtengo las citas pendientes de los pacientes para el dia de hoy
    async getPacientesConCitasPendientes() {
        const tratamientos = await this.tratamientoRepository.createQueryBuilder('t')
            .innerJoinAndSelect('t.paciente', 'p')
            .where('NOW() BETWEEN t.fecha_inicio AND t.fecha_fin')
            .andWhere(qb => {
                const subQuery = qb.subQuery()
                    .select('DISTINCT c.tratamientoId')
                    .from('cita', 'c')
                    .where('c.fecha_programada::date = NOW()::date')
                    .getQuery();
                return `t.id NOT IN ${subQuery}`;
            }).getMany();
        return tratamientos;
    }


    async getPacientesNuevos(fechaInicio: Date, fechaFin: Date) {
        return await this.pacienteRepository.createQueryBuilder('paciente')
            .where('paciente.created_at BETWEEN :fechaInicio AND :fechaFin', { fechaInicio, fechaFin })
            .getMany();
    }

    async getMapaCalorPacientes(){
        return await this.pacienteRepository.createQueryBuilder('paciente')
        .leftJoinAndSelect('paciente.direccion', 'direccion')
        .leftJoinAndSelect('direccion.zona', 'zona')
        .leftJoinAndSelect('zona.zona_uv', 'zona_uv')
        .getMany();
    }

    // Este reporte generado por Tasa de incidencia de TB todas las formas
    // N° de casos de TB TSF(nuevos y recaidas) notificados/Poblacion total del año x 100,000
    async getIndicadoresEvaluacionTbTSF(){
        return await this.tratamientoRepository.createQueryBuilder('tratamiento')
        .leftJoinAndSelect('tratamiento.paciente', 'paciente')
        .leftJoinAndSelect('tratamiento.tipo_tratamiento', 'tipo_tratamiento')
        .where('tipo_tratamiento.descripcion IN (:...tipos)', { tipos: ['Nuevo caso', 'Recaída'] })
        .getMany();
    }

    // N° de casos de TB Pulmonar (nuevo y recaidas) notificados/Poblacion total del año x 100,000
    async getIndicadoresEvaluacionTbP(){
        return await this.tratamientoRepository.createQueryBuilder('tratamiento')
        .leftJoinAndSelect('tratamiento.paciente', 'paciente')
        .leftJoinAndSelect('tratamiento.tipo_tratamiento', 'tipo_tratamiento')
        .leftJoinAndSelect('tratamiento.localizacion', 'localizacion')
        .where('tipo_tratamiento.descripcion IN (:...tipos)', { tipos: ['Nuevo caso', 'Recaída'] })
        .andWhere('localizacion.descripcion = :localizacion', { localizacion: 'Pulmonar' })
        .getMany();
    }

    // N° de casos fallecidos por TB TSF
    async getFallecidosTbTSF(){
        return await this.tratamientoRepository.createQueryBuilder('tratamiento')
        .leftJoinAndSelect('tratamiento.paciente', 'paciente')
        .leftJoinAndSelect('tratamiento.estado', 'estado_tratamiento')
        .where('estado_tratamiento.descripcion = :estado', { estado: 'Fallecido' })
        .getMany();
    }

    // Tasa de incidencia de TB Meningea en niños menores de 5 años
    async getIndicadoresEvaluacionTbMeningeaNinos(){
        return await this.tratamientoRepository.createQueryBuilder('tratamiento')
        .leftJoinAndSelect('tratamiento.paciente', 'paciente')
        .leftJoinAndSelect('tratamiento.localizacion', 'localizacion')
        .andWhere('paciente.fecha_nacimiento >= NOW() - INTERVAL \'5 years\'')
        .andWhere('localizacion.descripcion = :localizacion', { localizacion: 'Meninges' })
        .getMany();
    }

    async getMotivoNoVisita(fechaInicio: Date, fechaFin: Date){

        // Obtener cantidad total de citas en el rango
        const totalCitas = await this.citaRepository.createQueryBuilder('cita')
            .where('cita.fecha_programada BETWEEN :fechaInicio AND :fechaFin', { fechaInicio, fechaFin })
            .getCount();

        // Obtener cantidad de citas por motivo
        const motivos = await this.citaRepository.createQueryBuilder('cita')
            .innerJoin('cita.motivo', 'motivo')
            .select('motivo.descripcion', 'motivo')
            .addSelect('COUNT(cita.id)', 'cantidad')
            .where('cita.fecha_programada BETWEEN :fechaInicio AND :fechaFin', { fechaInicio, fechaFin })
            .groupBy('motivo.descripcion')
            .getRawMany();

        return {
            total_citas: totalCitas,
            motivos: motivos.map(m => ({
                motivo: m.motivo,
                cantidad: Number(m.cantidad)
            }))
        };
    }
    
}