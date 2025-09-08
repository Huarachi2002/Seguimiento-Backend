import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Paciente } from "../entities/paciente.entity";
import { Repository } from "typeorm";
import { CreatePacienteDto } from "../dto/create-paciente.dto";
import { UpdatePacienteDto } from "../dto/update-paciente.dto";
import { Contacto_Paciente } from "../entities/contacto.entity";
import { CreateContactoDto } from "../dto/create-contacto.dto";
import { Tipo_Parentesco } from "../entities/tipo_parentesco.entity";
import { UpdateContactoDto } from "../dto/update-contacto.dto";


@Injectable()
export class ContactoService {

    constructor(
        @InjectRepository(Paciente) private pacienteRepository: Repository<Paciente>,
        @InjectRepository(Contacto_Paciente) private contactoRepository: Repository<Contacto_Paciente>
    ) { }


    async findByPaciente(idPaciente: string): Promise<Contacto_Paciente[]> {
        return this.contactoRepository.find({ where: { paciente: { id: idPaciente } } });
    }

    async create(contacto: CreateContactoDto, paciente: Paciente, tipo_parentesco: Tipo_Parentesco): Promise<Contacto_Paciente> {
        const newContacto = this.contactoRepository.create(contacto);
        newContacto.paciente = paciente;
        newContacto.tipo_parentesco = tipo_parentesco;
        return this.contactoRepository.save(newContacto);
    }

    async update(id: string, contacto: UpdateContactoDto, paciente: Paciente, tipo_parentesco: Tipo_Parentesco): Promise<void> {
        const newContacto = this.contactoRepository.create(contacto);
        newContacto.paciente = paciente;
        newContacto.tipo_parentesco = tipo_parentesco;
        await this.contactoRepository.update(id, newContacto);
    }
}