import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Direccion } from "../entities/direccion.entity";
import { CreateDireccionDto } from "../dto/create-direccion.dto";
import { UpdateDireccionDto } from "../dto/update-direccion.dto";
import { Paciente } from "src/modules/paciente/entities/paciente.entity";


@Injectable()
export class DireccionService {

    constructor(
        @InjectRepository(Direccion) private direccionRepository: Repository<Direccion>
    ) { }

    async findOneByPaciente(idPaciente: string): Promise<Direccion> {
        return this.direccionRepository.findOneBy({ paciente: { id: idPaciente } });
    }

    async create(direccion: CreateDireccionDto, paciente: Paciente): Promise<Direccion> {
        const newDireccion = this.direccionRepository.create(direccion);
        newDireccion.paciente = paciente;
        return this.direccionRepository.save(newDireccion);
    }

    async update(id: string, direccion: UpdateDireccionDto): Promise<void> {
        await this.direccionRepository.update(id, direccion);
    }
}