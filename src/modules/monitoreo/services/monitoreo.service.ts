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
    ) {}

    // Pacientes en riesgo de abandono
    async getPacientesEnRiesgoAbandonoTratamiento(diasSinAsistir: number){ // TODO: FALTA ANALIZAR
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() - diasSinAsistir);
        const pacientes = await this.pacienteRepository.createQueryBuilder('paciente')
            .leftJoinAndSelect('paciente.tratamientos', 'tratamiento')
            .leftJoinAndSelect('tratamiento.citas', 'cita')
            .where('cita.fecha < :fechaLimite', { fechaLimite })
            
            .getMany();

        return pacientes;
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

    async getPacientesConCitasPendientes(){
        return await this.citaRepository.createQueryBuilder('cita')
            .leftJoinAndSelect('cita.tratamiento', 'tratamiento')
            .leftJoinAndSelect('tratamiento.paciente', 'paciente')
            .leftJoin('cita.estado', 'estado_cita')
            .where('cita.fecha_programada::date = NOW()::date')
            .andWhere('estado_cita.descripcion = :estado', { estado: 'Programado' })
            .getMany();
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
    
}