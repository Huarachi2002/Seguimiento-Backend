import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TratamientoTB } from "../entities/tratamientoTB.entity";
import { In, Repository } from "typeorm";
import { CreateTratamientoDto } from "../dto/create-tratamiento.dto";
import { Tipo_Tratamiento } from "../entities/tipo_tratamiento.entity";
import { Estado_Tratamiento } from "../entities/estado_tratamiento.entity";
import { UpdateTratamientoDto } from "../dto/update-tratamiento.dto";
import { CreateTipoTratamientoDto } from "../dto/create-tipo-tratamiento.dto";
import { CreateEstadoTratamientoDto } from "../dto/create-estado-tratamiento.dto";
import { UpdateTipoTratamientoDto } from "../dto/update-tipo-tratamiento.dto";


@Injectable()
export class TratamientoService {
    constructor(
        @InjectRepository(TratamientoTB) private tratamientoRepository: Repository<TratamientoTB>,
        @InjectRepository(Tipo_Tratamiento) private tipoTratamientoRepository: Repository<Tipo_Tratamiento>,
        @InjectRepository(Estado_Tratamiento) private estadoTratamientoRepository: Repository<Estado_Tratamiento>,
    ) {}

    async findOne(id: string): Promise<TratamientoTB> {
        return this.tratamientoRepository.findOne({ where: { id } });
    }
    
    async findByPaciente(pacienteId: string): Promise<TratamientoTB[]> {
        return this.tratamientoRepository.find({
            where: { paciente: { id: pacienteId } },
            relations: ['paciente', 'tipo_tratamientos', 'estado'],
        });
    }

    async getTiposTratamiento(): Promise<Tipo_Tratamiento[]> {
        return this.tipoTratamientoRepository.find();
    }

    async getTipoTratamientoById(id: string): Promise<Tipo_Tratamiento> {
        return this.tipoTratamientoRepository.findOne({ where: { id } });
    }

    async getEstadosTratamiento(): Promise<Estado_Tratamiento[]> {
        return this.estadoTratamientoRepository.find();
    }

    async getEstadoTratamientoById(id: string): Promise<Estado_Tratamiento> {
        return this.estadoTratamientoRepository.findOne({ where: { id } });
    }

    async create(tratamiento: CreateTratamientoDto, tipoTratamiento: Tipo_Tratamiento, estadoTratamiento: Estado_Tratamiento): Promise<TratamientoTB> {
        const newTratamiento = this.tratamientoRepository.create(tratamiento);
        newTratamiento.tipo_tratamiento = tipoTratamiento;
        newTratamiento.estado = estadoTratamiento;
        return this.tratamientoRepository.save(newTratamiento);
    }

    async createTipoTratamiento(tipoTratamiento: CreateTipoTratamientoDto): Promise<Tipo_Tratamiento> {
        return this.tipoTratamientoRepository.save(tipoTratamiento);
    }

    async createEstadoTratamiento(estadoTratamiento: CreateEstadoTratamientoDto): Promise<Estado_Tratamiento> {
        return this.estadoTratamientoRepository.save(estadoTratamiento);
    }

    async update(id: string, tratamiento: UpdateTratamientoDto, tipoTratamiento: Tipo_Tratamiento, estadoTratamiento: Estado_Tratamiento): Promise<TratamientoTB> {
        const existingTratamiento = await this.tratamientoRepository.preload({
            id,
            ...tratamiento,
            tipo_tratamiento: tipoTratamiento,
            estado: estadoTratamiento
        })
        if(!existingTratamiento){
            throw new Error('Tratamiento no encontrado');
        }
        return this.tratamientoRepository.save(existingTratamiento);
    }

    async updateTipoTratamiento(id: string, tipoTratamiento: UpdateTipoTratamientoDto): Promise<Tipo_Tratamiento> {
        const existingTipo = await this.tipoTratamientoRepository.preload({
            id,
            ...tipoTratamiento
        })
        if(!existingTipo){
            throw new Error('Tipo de Tratamiento no encontrado');
        }
        return this.tipoTratamientoRepository.save(existingTipo);
    }

    async updateEstadoTratamiento(id: string, estadoTratamiento: CreateEstadoTratamientoDto): Promise<Estado_Tratamiento> {
        const existingEstado = await this.estadoTratamientoRepository.preload({
            id,
            ...estadoTratamiento
        })
        if(!existingEstado){
            throw new Error('Estado de Tratamiento no encontrado');
        }
        return this.estadoTratamientoRepository.save(existingEstado);
    }
    
}