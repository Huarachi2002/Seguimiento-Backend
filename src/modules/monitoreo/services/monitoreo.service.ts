import { Motivo } from "@/modules/tratamiento/entities/motivo.entity";
import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Paciente } from "src/modules/paciente/entities/paciente.entity";
import { Cita } from "src/modules/tratamiento/entities/cita.entity";
import { TratamientoTB } from "src/modules/tratamiento/entities/tratamientoTB.entity";
import { Repository } from "typeorm";
import { RiesgoAbandonoDto } from "../dto/riesgo-abandono.dto";


@Injectable()
export class MonitoreoService {
    constructor(
        @InjectRepository(Paciente) private pacienteRepository: Repository<Paciente>,
        @InjectRepository(Cita) private citaRepository: Repository<Cita>,
        @InjectRepository(TratamientoTB) private tratamientoRepository: Repository<TratamientoTB>,
        @InjectRepository(Motivo) private motivoRepository: Repository<Motivo>,
    ) { }

    // Pacientes en riesgo de abandono
    async getPacientesEnRiesgoAbandonoTratamiento(dto: RiesgoAbandonoDto) {
        try {
            const fechaFin = new Date(dto.fecha_fin);
            const fechaInicio = new Date(dto.fecha_inicio);

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
                const diasPeriodo = (fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24);
                const T = diasPeriodo;
                const citasPerdidas = citas.filter(c => c.estado && c.estado.descripcion === 'Perdido');
                const M = citasPerdidas.length;

                if (M === 0) return null;

                let missRuns = 0;
                let maxRunLength = 0;
                let currentRunLength = 0;

                const diasPerdidos = citasPerdidas.map(c => {
                    const d = new Date(c.fecha_programada);
                    d.setHours(0, 0, 0, 0);
                    return d.getTime();
                });

                const diasUnicos = [...new Set(diasPerdidos)].sort((a, b) => a - b);

                if (diasUnicos.length > 0) {
                    missRuns = 1;
                    currentRunLength = 1;
                    maxRunLength = 1;

                    for (let i = 1; i < diasUnicos.length; i++) {
                        const diffTime = diasUnicos[i] - diasUnicos[i - 1];
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
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener pacientes en riesgo de abandono',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Pacientes que han abandonado
    async getPacientesAbandonados(diasAbandono: number) {  // TODO: Falta Analizar
        try {
            const fechaLimite = new Date();
            fechaLimite.setDate(fechaLimite.getDate() - diasAbandono);

            return await this.tratamientoRepository
                .createQueryBuilder('tratamiento')
                .leftJoinAndSelect('tratamiento.paciente', 'paciente')
                .leftJoinAndSelect('tratamiento.citas', 'cita')
                .where('tratamiento.estado = :estado', { estado: 'Abandonado' })
                .orWhere(qb => {
                    const subQuery = qb.subQuery()
                        .select('MAX(cita.fecha_programada)', 'ultimaCita')
                        .from('cita', 'cita')
                        .where('cita.tratamientoId = tratamiento.id')
                        .getQuery();
                    return `cita.fecha_programada IS NULL OR cita.fecha_programada < ${subQuery}`;
                })
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener pacientes abandonados',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Citas perdidas en un rango de fechas
    async getCitasPerdidas(fechaInicio: Date, fechaFin: Date) {  // TODO: Falta Analizar
        try {
            return await this.citaRepository.createQueryBuilder('cita')
                .leftJoinAndSelect('cita.paciente', 'paciente')
                .where('cita.fecha_programada BETWEEN :fechaInicio AND :fechaFin', { fechaInicio, fechaFin })
                .andWhere('cita.estado = :estado', { estado: 'Perdida' })
                .getMany();
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener citas perdidas',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Obtengo las citas pendientes de los pacientes para el dia de hoy
    async getPacientesConCitasPendientes() {
        try {
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
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener pacientes con citas pendientes',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }


    async getPacientesNuevos(fechaInicio: Date, fechaFin: Date) {
        try {
            return await this.pacienteRepository.createQueryBuilder('paciente')
                .where('paciente.created_at BETWEEN :fechaInicio AND :fechaFin', { fechaInicio, fechaFin })
                .getMany();
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener pacientes nuevos',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getMapaCalorPacientes() {
        try {
            return await this.pacienteRepository.createQueryBuilder('paciente')
                .leftJoinAndSelect('paciente.direccion', 'direccion')
                .leftJoinAndSelect('direccion.zona', 'zona')
                .leftJoinAndSelect('zona.zona_uv', 'zona_uv')
                .getMany();
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener mapa de calor de pacientes',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Este reporte generado por Tasa de incidencia de TB todas las formas
    // N° de casos de TB TSF(nuevos y recaidas) notificados/Poblacion total del año x 100,000
    async getIndicadoresEvaluacionTbTSF() {
        try {
            return await this.tratamientoRepository.createQueryBuilder('tratamiento')
                .leftJoinAndSelect('tratamiento.paciente', 'paciente')
                .leftJoinAndSelect('tratamiento.tipo_tratamiento', 'tipo_tratamiento')
                .where('tipo_tratamiento.descripcion IN (:...tipos)', { tipos: ['Nuevo caso', 'Recaída'] })
                .getMany();
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener indicadores de evaluación TB TSF',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // N° de casos de TB Pulmonar (nuevo y recaidas) notificados/Poblacion total del año x 100,000
    async getIndicadoresEvaluacionTbP() {
        try {
            return await this.tratamientoRepository.createQueryBuilder('tratamiento')
                .leftJoinAndSelect('tratamiento.paciente', 'paciente')
                .leftJoinAndSelect('tratamiento.tipo_tratamiento', 'tipo_tratamiento')
                .leftJoinAndSelect('tratamiento.localizacion', 'localizacion')
                .where('tipo_tratamiento.descripcion IN (:...tipos)', { tipos: ['Nuevo caso', 'Recaída'] })
                .andWhere('localizacion.descripcion = :localizacion', { localizacion: 'Pulmonar' })
                .getMany();
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener indicadores de evaluación TB Pulmonar',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // N° de casos fallecidos por TB TSF
    async getFallecidosTbTSF() {
        try {
            return await this.tratamientoRepository.createQueryBuilder('tratamiento')
                .leftJoinAndSelect('tratamiento.paciente', 'paciente')
                .leftJoinAndSelect('tratamiento.estado', 'estado_tratamiento')
                .where('estado_tratamiento.descripcion = :estado', { estado: 'Fallecido' })
                .getMany();
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener fallecidos por TB TSF',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Tasa de incidencia de TB Meningea en niños menores de 5 años
    async getIndicadoresEvaluacionTbMeningeaNinos() {
        try {
            return await this.tratamientoRepository.createQueryBuilder('tratamiento')
                .leftJoinAndSelect('tratamiento.paciente', 'paciente')
                .leftJoinAndSelect('tratamiento.localizacion', 'localizacion')
                .andWhere('paciente.fecha_nacimiento >= NOW() - INTERVAL \'5 years\'')
                .andWhere('localizacion.descripcion = :localizacion', { localizacion: 'Meninges' })
                .getMany();
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener indicadores TB Meningea en niños',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getMotivoNoVisita(fechaInicio: Date, fechaFin: Date) {
        try {
            // Obtener cantidad total de citas con motivo registrado en el rango
            const totalCitas = await this.citaRepository.createQueryBuilder('cita')
                .innerJoin('cita.motivo', 'motivo')
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
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener motivos de no visita',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

}