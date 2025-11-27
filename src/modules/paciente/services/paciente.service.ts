import { forwardRef, Inject, Injectable, HttpException, HttpStatus } from "@nestjs/common";
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
import { IAService } from "@/common/service/ia.service";
import { N8NService } from "@/common/service/n8n.service";
import { UserService } from "@/modules/tratamiento/services/user.service";
import { User } from "@/modules/tratamiento/entities/user.entity";

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
        
        @Inject(forwardRef(() => DireccionService)) private direccionService: DireccionService,
        @Inject(forwardRef(() => IAService)) private iaService: IAService,
        @Inject(forwardRef(() => N8NService)) private n8nService: N8NService,
        @Inject(forwardRef(() => UserService)) private userService: UserService
    ) { }

    async findAll(): Promise<Paciente[]> {
        try {
            return await this.pacienteRepository.find({
                relations: {
                    direccion: true
                }
            });
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener pacientes',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findOne(id: string): Promise<Paciente> {
        try {
            return await this.pacienteRepository.findOneBy({ id });
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener paciente',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findDireccionByPaciente(idPaciente: string): Promise<Direccion> {
        try {
            return await this.direccionService.findOneByPaciente(idPaciente);
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener dirección del paciente',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findContactoById(id: string): Promise<Contacto_Paciente> {
        try {
            return await this.contactoRepository.findOneBy({ id });
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener contacto',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findContactosByPaciente(id: string): Promise<Contacto_Paciente[]> {
        try {
            return await this.contactoRepository.find({
                where: { paciente: { id } },
                relations: ['tipo_parentesco', 'paciente'],
            });
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener contactos del paciente',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getTipoParentescos(): Promise<Tipo_Parentesco[]> {
        try {
            return await this.tipoParentescoRepository.find();
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener tipos de parentesco',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findByTelefono(telefono: number): Promise<Paciente> {
        try {
            return await this.pacienteRepository.findOne({
                where: { telefono }
            });
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al buscar paciente por teléfono',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findCitasByPaciente(idPaciente: string): Promise<Cita[]> {
        try {
            const data = await this.citaRepository.find({
                where: { tratamiento: { paciente: { id: idPaciente } } },
                relations: {
                    estado: true,
                    tipo: true
                }
            });
            return data;
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener citas del paciente',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findByCarnet(carnet: string): Promise<Paciente> {
        try {
            return await this.pacienteRepository.findOne({
                where: { numero_doc: carnet  }
            });
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al buscar paciente por carnet',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findTipoParentescoById(id: string): Promise<Tipo_Parentesco> {
        try {
            return await this.tipoParentescoRepository.findOne({
                where: { id },
            });
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener tipo de parentesco',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async createTipoParentesco(tipoParentesco: CreateTipoParentescoDto): Promise<Tipo_Parentesco> {
        try {
            return await this.tipoParentescoRepository.save(tipoParentesco);
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al crear tipo de parentesco',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // --- Enfermedades (catalogo)
    async createEnfermedad(enf: CreateEnfermedadDto): Promise<Enfermedad> {
        try {
            const exists = await this.enfermedadRepository.findOne({ where: { descripcion: enf.descripcion } });
            if (exists) {
                throw new HttpException(
                    {
                        success: false,
                        message: 'Enfermedad ya existe',
                        data: null,
                        error: 'Bad Request',
                    },
                    HttpStatus.BAD_REQUEST,
                );
            }
            const entity = this.enfermedadRepository.create(enf as any);
            return await this.enfermedadRepository.save(entity as any);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al crear enfermedad',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async updateEnfermedad(id: string, enf: UpdateEnfermedadDto): Promise<Enfermedad> {
        try {
            const existing = await this.enfermedadRepository.preload({ id, ...enf } as any);
            if (!existing) {
                throw new HttpException(
                    {
                        success: false,
                        message: 'Enfermedad no encontrada',
                        data: null,
                        error: 'Not Found',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }
            return await this.enfermedadRepository.save(existing as any);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al actualizar enfermedad',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getEnfermedades(): Promise<Enfermedad[]> {
        try {
            return await this.enfermedadRepository.find();
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener enfermedades',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // --- Asociaciones paciente - enfermedad
    async addEnfermedadToPaciente(dto: CreatePacienteEnfermedadDto): Promise<Paciente_Enfermedad> {
        try {
            const paciente = await this.findOne(dto.idPaciente);
            if (!paciente) {
                throw new HttpException(
                    {
                        success: false,
                        message: 'Paciente no encontrado',
                        data: null,
                        error: 'Not Found',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }
            const enfermedad = await this.enfermedadRepository.findOneBy({ id: dto.idEnfermedad });
            if (!enfermedad) {
                throw new HttpException(
                    {
                        success: false,
                        message: 'Enfermedad no encontrada',
                        data: null,
                        error: 'Not Found',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }
            const existing = await this.pacienteEnfermedadRepository.findOne({ where: { paciente: { id: dto.idPaciente }, enfermedad: { id: dto.idEnfermedad } } });
            if (existing) return existing;
            const pe = this.pacienteEnfermedadRepository.create({ paciente, enfermedad } as any);
            return await this.pacienteEnfermedadRepository.save(pe as any);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al asociar enfermedad al paciente',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getEnfermedadesByPaciente(idPaciente: string): Promise<Paciente_Enfermedad[]> {
        try {
            return await this.pacienteEnfermedadRepository.find({ where: { paciente: { id: idPaciente } }, relations: ['enfermedad'] });
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener enfermedades del paciente',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async addEnfermedadesToPaciente(idPaciente: string, enfermedades: any[]) {
        try {
            for (const enfermedad of enfermedades) {
                await this.addEnfermedadToPaciente({ idPaciente, idEnfermedad: enfermedad.id });
            }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al asociar enfermedades al paciente',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // --- Sintomas (catalogo)
    async createSintoma(s: CreateSintomaDto): Promise<Sintoma> {
        try {
            const exists = await this.sintomaRepository.findOne({ where: { descripcion: s.descripcion } });
            if (exists) {
                throw new HttpException(
                    {
                        success: false,
                        message: 'Sintoma ya existe',
                        data: null,
                        error: 'Bad Request',
                    },
                    HttpStatus.BAD_REQUEST,
                );
            }
            const entity = this.sintomaRepository.create(s as any);
            return await this.sintomaRepository.save(entity as any);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al crear síntoma',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async updateSintoma(id: string, s: UpdateSintomaDto): Promise<Sintoma> {
        try {
            const existing = await this.sintomaRepository.preload({ id, ...s } as any);
            if (!existing) {
                throw new HttpException(
                    {
                        success: false,
                        message: 'Síntoma no encontrado',
                        data: null,
                        error: 'Not Found',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }
            return await this.sintomaRepository.save(existing as any);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al actualizar síntoma',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getSintomas(): Promise<Sintoma[]> {
        try {
            return await this.sintomaRepository.find();
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener síntomas',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async addSintomaToPaciente(dto: CreatePacienteSintomaDto): Promise<Paciente_Sintoma> {
        try {
            const paciente = await this.findOne(dto.idPaciente);
            if (!paciente) {
                throw new HttpException(
                    {
                        success: false,
                        message: 'Paciente no encontrado',
                        data: null,
                        error: 'Not Found',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }
            const sintoma = await this.sintomaRepository.findOneBy({ id: dto.idSintoma });
            if (!sintoma) {
                throw new HttpException(
                    {
                        success: false,
                        message: 'Síntoma no encontrado',
                        data: null,
                        error: 'Not Found',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }
            const existing = await this.pacienteSintomaRepository.findOne({ where: { paciente: { id: dto.idPaciente }, sintoma: { id: dto.idSintoma } } });
            if (existing) return existing;
            const ps = this.pacienteSintomaRepository.create({ paciente, sintoma } as any);
            return await this.pacienteSintomaRepository.save(ps as any);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al asociar síntoma al paciente',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getSintomasByPaciente(idPaciente: string): Promise<Paciente_Sintoma[]> {
        try {
            return await this.pacienteSintomaRepository.find({ where: { paciente: { id: idPaciente } }, relations: ['sintoma'] });
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener síntomas del paciente',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async addSintomasToPaciente(idPaciente: string, sintomas: any[]) {
        try {
            for (const sintoma of sintomas) {
                await this.addSintomaToPaciente({ idPaciente, idSintoma: sintoma.id });
            }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al asociar síntomas al paciente',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
    

    async createContactoForPaciente(contactoDto: CreateContactoDto, paciente: Paciente, tipoParentesco: Tipo_Parentesco): Promise<Contacto_Paciente> {
        try {
            const newContacto = this.contactoRepository.create(contactoDto);
            newContacto.paciente = paciente;
            newContacto.tipo_parentesco = tipoParentesco;
            return await this.contactoRepository.save(newContacto);
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al crear contacto del paciente',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async create(paciente: CreatePacienteDto): Promise<Paciente> {
        try {
            return await this.pacienteRepository.save(paciente);
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al crear paciente',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async updateTipoParentesco(id: string, tipoParentesco: UpdateTipoParentescoDto): Promise<Tipo_Parentesco> {
        try {
            const existingTipo = await this.tipoParentescoRepository.preload({
                id,
                ...tipoParentesco
            })
            if(!existingTipo){
                throw new HttpException(
                    {
                        success: false,
                        message: 'Tipo de Parentesco no encontrado',
                        data: null,
                        error: 'Not Found',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }
            return await this.tipoParentescoRepository.save(existingTipo);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al actualizar tipo de parentesco',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async updateContacto(id: string, contacto: CreateContactoDto, paciente: Paciente, tipoParentesco: Tipo_Parentesco): Promise<Contacto_Paciente> {
        try {
            const existingContacto = await this.contactoRepository.preload({
                id,
                ...contacto,
                paciente,
                tipo_parentesco: tipoParentesco
            })
            if(!existingContacto){
                throw new HttpException(
                    {
                        success: false,
                        message: 'Contacto no encontrado',
                        data: null,
                        error: 'Not Found',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }
            return await this.contactoRepository.save(existingContacto);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al actualizar contacto',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async update(id: string, paciente: UpdatePacienteDto): Promise<Paciente> {
        try {
            const existingPaciente = await this.pacienteRepository.preload({
                id,
                ...paciente
            })
            if(!existingPaciente){
                throw new HttpException(
                    {
                        success: false,
                        message: 'Paciente no encontrado',
                        data: null,
                        error: 'Not Found',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }
            return await this.pacienteRepository.save(existingPaciente);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al actualizar paciente',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Historial Chat
    async findHistorialConversacionByPaciente(telefono: string): Promise<any> {
        try {
            const data = await this.iaService.getHistorialConversacionByPaciente(telefono);
            if (!data) {
                throw new HttpException(
                    {
                        success: false,
                        message: 'Historial no encontrado',
                        data: null,
                        error: 'Not Found',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }
            return data;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener historial de conversación',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async pacienteRiesgoSalud(telefono: number): Promise<User[]> {
        try {
            const paciente = await this.findByTelefono(telefono);
            if (!paciente) {
                throw new HttpException(
                    {
                        success: false,
                        message: 'Paciente no encontrado',
                        data: null,
                        error: 'Not Found',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }

            const contactos = await this.findContactosByPaciente(paciente.id);
            
            const paciente_enfermedad = await this.pacienteEnfermedadRepository.find({
                where: {
                    paciente: {
                        id: paciente.id
                    }
                },
                relations: ['enfermedad'],
                select: ['enfermedad']
            });
            const enfermedad: Enfermedad[] = paciente_enfermedad.map((paciente_enfermedad) => paciente_enfermedad.enfermedad);

            const supervisores_destinatarios = await this.userService.getUsersByNotificationWhatsapp();
            
            this.n8nService.pacienteRiesgoSalud(supervisores_destinatarios, paciente, enfermedad, contactos);

            return supervisores_destinatarios;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al procesar riesgo de salud del paciente',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}