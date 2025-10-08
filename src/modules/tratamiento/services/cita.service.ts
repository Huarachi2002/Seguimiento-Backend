import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TratamientoTB } from "../entities/tratamientoTB.entity";
import { In, Repository } from "typeorm";
import { Cita } from "../entities/cita.entity";
import { Tipo_Cita } from "../entities/tipo_cita.entity";
import { Estado_Tratamiento } from "../entities/estado_tratamiento.entity";
import { User } from "../entities/user.entity";
import { CreateCitaDto } from "../dto/create-cita.dto";
import { UpdateCitaDto } from "../dto/update-cita.dto";
import { Estado_Cita } from "../entities/estado_cita.entity";
import { Motivo } from "../entities/motivo.entity";


@Injectable()
export class CitaService {
    constructor(
        @InjectRepository(Cita) private citaRepository: Repository<Cita>,
        @InjectRepository(Estado_Cita) private estadoCitaRepository: Repository<Estado_Cita>,
        @InjectRepository(Tipo_Cita) private tipoCitaRepository: Repository<Tipo_Cita>,
        @InjectRepository(Motivo) private motivoRepository: Repository<Motivo>,
    ) {}

    async findAll(): Promise<Cita[]> {
        return this.citaRepository.find({
            relations: {
                tratamiento: { paciente: true },
                estado: true,
                tipo: true,
                user: true
            },
        });
    }

    async findOne(id: string): Promise<Cita> {
        return this.citaRepository.findOneBy({ id });
    }

    async findByPaciente(pacienteId: string): Promise<Cita[]> {
        return this.citaRepository.find({
            where: { tratamiento: { paciente: { id: pacienteId } } },
            relations: {
                tratamiento: { paciente: true },
                estado: true,
                tipo: true,
                user: true
            },
        });
    }

    async findByTratamiento(tratamientoId: string): Promise<Cita[]> {
        return this.citaRepository.find({
            where: { tratamiento: { id: tratamientoId } },
            relations: {
                tratamiento: true,
                tipo: true,
                estado: true,
            },
        });
    }

    async getEstadosCita(): Promise<Estado_Cita[]> {
        return this.estadoCitaRepository.find();
    }

    async getEstadoCitaById(id: string): Promise<Estado_Cita> {
        return this.estadoCitaRepository.findOne({ where: { id } });
    }

    async getTiposCita(): Promise<Tipo_Cita[]> {
        return this.tipoCitaRepository.find();
    }

    async getMotivos(): Promise<Motivo[]> {
        return this.motivoRepository.find();
    }

    async getTipoCitaById(id: string): Promise<Tipo_Cita> {
        return this.tipoCitaRepository.findOne({ where: { id } });
    }

    async create(cita: CreateCitaDto, tratamiento: TratamientoTB, tipoCita: Tipo_Cita, estadoCita: Estado_Cita, user: User): Promise<Cita> {
        const newCita = this.citaRepository.create(cita);
        newCita.estado = estadoCita;
        newCita.tipo = tipoCita;
        newCita.tratamiento = tratamiento;
        // newCita.user = user;
        return this.citaRepository.save(newCita);
    }

    async createTipoCita(tipoCita: any): Promise<Tipo_Cita> {
        return this.tipoCitaRepository.save(tipoCita);
    }

    async createEstadoCita(estadoCita: any): Promise<Estado_Cita> {
        return this.estadoCitaRepository.save(estadoCita);
    }

    async update(id: string, cita: UpdateCitaDto, tratamiento: TratamientoTB, tipoCita: Tipo_Cita, estadoCita: Estado_Cita, user: User): Promise<Cita> {
        const existingCita = await this.citaRepository.preload({
            id,
            ...cita,
            tratamiento,
            tipo: tipoCita,
            estado: estadoCita,
            user
        })
        if(!existingCita){
            throw new Error('Cita no encontrada');
        }
        return this.citaRepository.save(existingCita);
    }

    async updateEstadoCita(id: string, estadoCita: any): Promise<Estado_Cita> {
        const existingEstado = await this.estadoCitaRepository.preload({
            id,
            ...estadoCita
        })
        if(!existingEstado){
            throw new Error('Estado de Cita no encontrado');
        }
        return this.estadoCitaRepository.save(existingEstado);
    }

    async updateTipoCita(id: string, tipoCita: any): Promise<Tipo_Cita> {
        const existingTipo = await this.tipoCitaRepository.preload({
            id,
            ...tipoCita
        })
        if(!existingTipo){
            throw new Error('Tipo de Cita no encontrado');
        }
        return this.tipoCitaRepository.save(existingTipo);
    }
}