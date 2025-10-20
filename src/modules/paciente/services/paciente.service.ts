import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Paciente } from "../entities/paciente.entity";
import { Repository } from "typeorm";
import { CreatePacienteDto } from "../dto/create-paciente.dto";
import { UpdatePacienteDto } from "../dto/update-paciente.dto";
import { Contacto_Paciente } from "../entities/contacto.entity";
import { CreateContactoDto } from "../dto/create-contacto.dto";
import { Tipo_Parentesco } from "../entities/tipo_parentesco.entity";
import { CreateTipoParentescoDto } from "../dto/create-tipo-parentesco.dto";
import { UpdateTipoParentescoDto } from "../dto/update-tipo-parentesco.dto";
import { DireccionService } from "@/modules/monitoreo/services/direccion.service";
import { Direccion } from "@/modules/monitoreo/entities/direccion.entity";
import { Cita } from "@/modules/tratamiento/entities/cita.entity";


@Injectable()
export class PacienteService {

    constructor(
        @InjectRepository(Paciente) private pacienteRepository: Repository<Paciente>,
        @InjectRepository(Contacto_Paciente) private contactoRepository: Repository<Contacto_Paciente>,
        @InjectRepository(Tipo_Parentesco) private tipoParentescoRepository: Repository<Tipo_Parentesco>,
        @InjectRepository(Cita) private citaRepository: Repository<Cita>,
        
        @Inject(forwardRef(() => DireccionService))
        private direccionService: DireccionService
    ) { }

    async findAll(): Promise<Paciente[]> {
        return this.pacienteRepository.find({
            relations: {
                direccion: true
            }
        });
    }

    async findOne(id: string): Promise<Paciente> {
        return this.pacienteRepository.findOneBy({ id });
    }

    async findDireccionByPaciente(idPaciente: string): Promise<Direccion> {
        return this.direccionService.findOneByPaciente(idPaciente);
    }

    async findContactoById(id: string): Promise<Contacto_Paciente> {
        return this.contactoRepository.findOneBy({ id });
    }

    async findContactosByPaciente(id: string): Promise<Contacto_Paciente[]> {
        return this.contactoRepository.find({
            where: { paciente: { id } },
            relations: ['tipo_parentesco', 'paciente'],
        });
    }

    async getTipoParentescos(): Promise<Tipo_Parentesco[]> {
        return this.tipoParentescoRepository.find();
    }

    async findByTelefono(telefono: number): Promise<Paciente> {
        return this.pacienteRepository.findOne({
            where: { telefono }
        });
    }

    async findCitasByPaciente(idPaciente: string): Promise<Cita[]> {
        const data = await this.citaRepository.find({
            where: { tratamiento: { paciente: { id: idPaciente } } },
            relations: {
                estado: true,
                tipo: true
            }
        });
        return data;
    }

    async findByCarnet(carnet: string): Promise<Paciente> {
        return this.pacienteRepository.findOne({
            where: { numero_doc: carnet  }
        });
    }

    async findTipoParentescoById(id: string): Promise<Tipo_Parentesco> {
        return this.tipoParentescoRepository.findOne({
            where: { id },
        });
    }

    async createTipoParentesco(tipoParentesco: CreateTipoParentescoDto): Promise<Tipo_Parentesco> {
        return this.tipoParentescoRepository.save(tipoParentesco);
    }
    

    async createContactoForPaciente(contactoDto: CreateContactoDto, paciente: Paciente, tipoParentesco: Tipo_Parentesco): Promise<Contacto_Paciente> {
        const newContacto = this.contactoRepository.create(contactoDto);
        newContacto.paciente = paciente;
        newContacto.tipo_parentesco = tipoParentesco;
        return this.contactoRepository.save(newContacto);
    }

    async create(paciente: CreatePacienteDto): Promise<Paciente> {
        return this.pacienteRepository.save(paciente);
    }

    async updateTipoParentesco(id: string, tipoParentesco: UpdateTipoParentescoDto): Promise<Tipo_Parentesco> {
        const existingTipo = await this.tipoParentescoRepository.preload({
            id,
            ...tipoParentesco
        })
        if(!existingTipo){
            throw new Error('Tipo de Parentesco no encontrado');
        }
        return this.tipoParentescoRepository.save(existingTipo);
    }

    async updateContacto(id: string, contacto: CreateContactoDto, paciente: Paciente, tipoParentesco: Tipo_Parentesco): Promise<Contacto_Paciente> {
        const existingContacto = await this.contactoRepository.preload({
            id,
            ...contacto,
            paciente,
            tipo_parentesco: tipoParentesco
        })
        if(!existingContacto){
            throw new Error('Contacto no encontrado');
        }
        return this.contactoRepository.save(existingContacto);
    }

    async update(id: string, paciente: UpdatePacienteDto): Promise<Paciente> {
        const existingPaciente = await this.pacienteRepository.preload({
            id,
            ...paciente
        })
        if(!existingPaciente){
            throw new Error('Paciente no encontrado');
        }
        return this.pacienteRepository.save(existingPaciente);
    }
}