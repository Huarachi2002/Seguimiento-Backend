import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Paciente } from "../entities/paciente.entity";
import { Repository } from "typeorm";
import { CreatePacienteDto } from "../dto/create-paciente.dto";
import { UpdatePacienteDto } from "../dto/update-paciente.dto";
import { Contacto_Paciente } from "../entities/contacto.entity";
import { CreateContactoDto } from "../dto/create-contacto.dto";
import { Tipo_Parentesco } from "../entities/tipo_parentesco.entity";
import { Enfermedad } from "../entities/enfermedad.entity";
import { Paciente_Enfermedad } from "../entities/paciente_enfermedad.entity";
import { Sintoma } from "../entities/sintoma.entity";
import { Paciente_Sintoma } from "../entities/paciente_sintoma.entity";
import { CreateTipoParentescoDto } from "../dto/create-tipo-parentesco.dto";
import { UpdateTipoParentescoDto } from "../dto/update-tipo-parentesco.dto";
import { CreateEnfermedadDto } from "../dto/create-enfermedad.dto";
import { UpdateEnfermedadDto } from "../dto/update-enfermedad.dto";
import { CreatePacienteEnfermedadDto } from "../dto/create-paciente-enfermedad.dto";
import { CreateSintomaDto } from "../dto/create-sintoma.dto";
import { UpdateSintomaDto } from "../dto/update-sintoma.dto";
import { CreatePacienteSintomaDto } from "../dto/create-paciente-sintoma.dto";
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
        @InjectRepository(Enfermedad) private enfermedadRepository: Repository<Enfermedad>,
        @InjectRepository(Paciente_Enfermedad) private pacienteEnfermedadRepository: Repository<Paciente_Enfermedad>,
        @InjectRepository(Sintoma) private sintomaRepository: Repository<Sintoma>,
        @InjectRepository(Paciente_Sintoma) private pacienteSintomaRepository: Repository<Paciente_Sintoma>,
        
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

    // --- Enfermedades (catalogo)
    async createEnfermedad(enf: CreateEnfermedadDto): Promise<Enfermedad> {
        const exists = await this.enfermedadRepository.findOne({ where: { descripcion: enf.descripcion } });
        if (exists) throw new Error('Enfermedad ya existe');
        const entity = this.enfermedadRepository.create(enf as any);
        return this.enfermedadRepository.save(entity as any);
    }

    async updateEnfermedad(id: string, enf: UpdateEnfermedadDto): Promise<Enfermedad> {
        const existing = await this.enfermedadRepository.preload({ id, ...enf } as any);
        if (!existing) throw new Error('Enfermedad no encontrada');
        return this.enfermedadRepository.save(existing as any);
    }

    async getEnfermedades(): Promise<Enfermedad[]> {
        return this.enfermedadRepository.find();
    }

    // --- Asociaciones paciente - enfermedad
    async addEnfermedadToPaciente(dto: CreatePacienteEnfermedadDto): Promise<Paciente_Enfermedad> {
        const paciente = await this.findOne(dto.idPaciente);
        if (!paciente) throw new Error('Paciente no encontrado');
        const enfermedad = await this.enfermedadRepository.findOneBy({ id: dto.idEnfermedad });
        if (!enfermedad) throw new Error('Enfermedad no encontrada');
        const existing = await this.pacienteEnfermedadRepository.findOne({ where: { paciente: { id: dto.idPaciente }, enfermedad: { id: dto.idEnfermedad } } });
        if (existing) return existing;
        const pe = this.pacienteEnfermedadRepository.create({ paciente, enfermedad } as any);
        return this.pacienteEnfermedadRepository.save(pe as any);
    }

    async getEnfermedadesByPaciente(idPaciente: string): Promise<Paciente_Enfermedad[]> {
        return this.pacienteEnfermedadRepository.find({ where: { paciente: { id: idPaciente } }, relations: ['enfermedad'] });
    }

    async addEnfermedadesToPaciente(idPaciente: string, enfermedades: any[]) {
        for (const enfermedad of enfermedades) {
            await this.addEnfermedadToPaciente({ idPaciente, idEnfermedad: enfermedad.id });
        }
    }

    // --- Sintomas (catalogo)
    async createSintoma(s: CreateSintomaDto): Promise<Sintoma> {
        const exists = await this.sintomaRepository.findOne({ where: { descripcion: s.descripcion } });
        if (exists) throw new Error('Sintoma ya existe');
        const entity = this.sintomaRepository.create(s as any);
        return this.sintomaRepository.save(entity as any);
    }

    async updateSintoma(id: string, s: UpdateSintomaDto): Promise<Sintoma> {
        const existing = await this.sintomaRepository.preload({ id, ...s } as any);
        if (!existing) throw new Error('Sintoma no encontrado');
        return this.sintomaRepository.save(existing as any);
    }

    async getSintomas(): Promise<Sintoma[]> {
        return this.sintomaRepository.find();
    }

    async addSintomaToPaciente(dto: CreatePacienteSintomaDto): Promise<Paciente_Sintoma> {
        const paciente = await this.findOne(dto.idPaciente);
        if (!paciente) throw new Error('Paciente no encontrado');
        const sintoma = await this.sintomaRepository.findOneBy({ id: dto.idSintoma });
        if (!sintoma) throw new Error('Sintoma no encontrado');
        const existing = await this.pacienteSintomaRepository.findOne({ where: { paciente: { id: dto.idPaciente }, sintoma: { id: dto.idSintoma } } });
        if (existing) return existing;
        const ps = this.pacienteSintomaRepository.create({ paciente, sintoma } as any);
        return this.pacienteSintomaRepository.save(ps as any);
    }

    async getSintomasByPaciente(idPaciente: string): Promise<Paciente_Sintoma[]> {
        return this.pacienteSintomaRepository.find({ where: { paciente: { id: idPaciente } }, relations: ['sintoma'] });
    }

    async addSintomasToPaciente(idPaciente: string, sintomas: any[]) {
        for (const sintoma of sintomas) {
            await this.addSintomaToPaciente({ idPaciente, idSintoma: sintoma.id });
        }
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