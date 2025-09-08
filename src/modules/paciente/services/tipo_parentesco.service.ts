import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Paciente } from "../entities/paciente.entity";
import { Repository } from "typeorm";
import { CreatePacienteDto } from "../dto/create-paciente.dto";
import { UpdatePacienteDto } from "../dto/update-paciente.dto";
import { Tipo_Parentesco } from "../entities/tipo_parentesco.entity";
import { CreateTipoParentescoDto } from "../dto/create-tipo-parentesco.dto";
import { UpdateTipoParentescoDto } from "../dto/update-tipo-parentesco.dto";


@Injectable()
export class TipoParentescoService {

    constructor(
        @InjectRepository(Tipo_Parentesco) private tipoParentescoRepository: Repository<Tipo_Parentesco>
    ) { }

    async findAll(): Promise<Tipo_Parentesco[]> {
        return this.tipoParentescoRepository.find();
    }

    async findOne(id: string): Promise<Tipo_Parentesco> {
        return this.tipoParentescoRepository.findOneBy({ id });
    }

    async create(tipoParentesco: CreateTipoParentescoDto): Promise<Tipo_Parentesco> {
        return this.tipoParentescoRepository.save(tipoParentesco);
    }

    async update(id: string, tipoParentesco: UpdateTipoParentescoDto): Promise<void> {
        await this.tipoParentescoRepository.update(id, tipoParentesco);
    }
}