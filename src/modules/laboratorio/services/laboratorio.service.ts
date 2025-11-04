import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Paciente } from "@/modules/paciente/entities/paciente.entity";
import { Laboratorio } from "../entities/laboratorio.entity";

import { Tipo_Control } from "../entities/tipo_control.entity";
import { Tipo_Laboratorio } from "../entities/tipo_laboratorio.entity";
import { Tipo_Resultado } from "../entities/tipo_resultado.entity";

import { CreateLaboratorioDto } from "../dto/create-laboratorio.dto";


@Injectable()
export class LaboratorioService {

    constructor(
        @InjectRepository(Laboratorio) private laboratorioRepository: Repository<Laboratorio>,
        @InjectRepository(Tipo_Control) private tipoControlRepository: Repository<Tipo_Control>,
        @InjectRepository(Tipo_Laboratorio) private tipoLaboratorioRepository: Repository<Tipo_Laboratorio>,
        @InjectRepository(Tipo_Resultado) private tipoResultadoRepository: Repository<Tipo_Resultado>,        
    ) { }

    async getTiposControl(): Promise<Tipo_Control[]> {
        return this.tipoControlRepository.find();
    }

    async getTiposLaboratorio(): Promise<Tipo_Laboratorio[]> {
        return this.tipoLaboratorioRepository.find();
    }

    async getTiposResultadoByTipoLaboratorio(idTipoLaboratorio: string): Promise<Tipo_Resultado[]> {
        return this.tipoResultadoRepository.find({
            where: { tipo_laboratorio: { id: idTipoLaboratorio } },
        });
    }

    async getTipoResultadoById(id: string): Promise<Tipo_Resultado> {
         return this.tipoResultadoRepository.findOneBy({ id });
    }

    async getTipoLaboratorioById(id: string): Promise<Tipo_Laboratorio> {
         return this.tipoLaboratorioRepository.findOneBy({ id });
    }

    async getTipoControlById(id: string): Promise<Tipo_Control> {
         return this.tipoControlRepository.findOneBy({ id });
    }


    async createLaboratorio(
        dto: CreateLaboratorioDto, 
        paciente:Paciente, 
        tipo_control: Tipo_Control, 
        tipo_laboratorio: Tipo_Laboratorio, 
        tipo_resultado: Tipo_Resultado): Promise<Laboratorio> {

        const laboratorio = this.laboratorioRepository.create({
            codigo: dto.codigo,
            fecha: dto.fecha,
            observacion: dto.observacion,
            paciente,
            tipo_control,
            tipo_laboratorio,
            tipo_resultado
        });
        return this.laboratorioRepository.save(laboratorio);
    }

    async getLaboratoriosByPaciente(idPaciente: string): Promise<Laboratorio[]> {
        return this.laboratorioRepository.find({
            where: {paciente: {id: idPaciente }},
            relations:{
                paciente: true,
                tipo_control: true,
                tipo_laboratorio: true,
                tipo_resultado: true
            }
        });
    }

    async getLaboratorios(): Promise<Laboratorio[]> {
        return this.laboratorioRepository.find({
            relations:{
                paciente: true,
                tipo_control: true,
                tipo_laboratorio: true,
                tipo_resultado: true
            }
        });
    }
}