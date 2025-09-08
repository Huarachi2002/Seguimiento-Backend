import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Paciente } from "../entities/paciente.entity";
import { Repository } from "typeorm";
import { CreatePacienteDto } from "../dto/create-paciente.dto";
import { UpdatePacienteDto } from "../dto/update-paciente.dto";


@Injectable()
export class PacienteService {

    constructor(
        @InjectRepository(Paciente) private pacienteRepository: Repository<Paciente>
    ) { }

    async findAll(): Promise<Paciente[]> {
        return this.pacienteRepository.find();
    }

    async findOne(id: string): Promise<Paciente> {
        return this.pacienteRepository.findOneBy({ id });
    }

    async create(paciente: CreatePacienteDto): Promise<Paciente> {
        return this.pacienteRepository.save(paciente);
    }

    async update(id: string, paciente: UpdatePacienteDto): Promise<void> {
        await this.pacienteRepository.update(id, paciente);
    }
}