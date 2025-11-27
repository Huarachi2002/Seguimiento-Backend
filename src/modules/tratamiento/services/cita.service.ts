import { forwardRef, Inject, Injectable, Logger, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TratamientoTB } from "../entities/tratamientoTB.entity";
import { Repository } from "typeorm";
import { Cita } from "../entities/cita.entity";
import { Tipo_Cita } from "../entities/tipo_cita.entity";
import { User } from "../entities/user.entity";
import { CreateCitaDto } from "../dto/create-cita.dto";
import { UpdateCitaDto } from "../dto/update-cita.dto";
import { CreateMotivoDto } from "../dto/create-motivo.dto";
import { UpdateMotivoDto } from "../dto/update-motivo.dto";
import { Estado_Cita } from "../entities/estado_cita.entity";
import { Motivo } from "../entities/motivo.entity";
import { N8NService } from "@/common/service/n8n.service";
import { TratamientoService } from "./tratamiento.service";


@Injectable()
export class CitaService {
    private readonly logger = new Logger(CitaService.name);

    constructor(
        @InjectRepository(Cita) private citaRepository: Repository<Cita>,
        @InjectRepository(Estado_Cita) private estadoCitaRepository: Repository<Estado_Cita>,
        @InjectRepository(Tipo_Cita) private tipoCitaRepository: Repository<Tipo_Cita>,
        @InjectRepository(Motivo) private motivoRepository: Repository<Motivo>,

        @Inject(forwardRef(() => N8NService)) private n8nService: N8NService,
        @Inject(forwardRef(() => TratamientoService)) private tratamientoService: TratamientoService,
    ) {}

    // Enviar recordatorio de cita a todas las citas programadas para el dia hoy con 3 horas de anticipacion
    async enviarRecordatorioCita(): Promise<any> {
        try {
            this.logger.log('Iniciando proceso de envío de recordatorios de cita...');
            const now = new Date();
            
            // Obtener las citas pendientes en para todo el día de hoy
            const citasPendientes = await this.citaRepository
                .createQueryBuilder('cita')
                .leftJoinAndSelect('cita.tratamiento', 'tratamiento')
                .leftJoinAndSelect('tratamiento.paciente', 'paciente')
                .leftJoinAndSelect('cita.estado', 'estado')
                .leftJoinAndSelect('cita.tipo', 'tipo') 
                .where('cita.fecha_programada BETWEEN :nowInicio AND :nowFin', {
                nowInicio: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0),
                nowFin: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59),
                })
                .andWhere('estado.descripcion = :estado', { estado: 'Programado' })
                .getMany();

            this.logger.log(`Se encontraron ${citasPendientes.length} citas pendientes para enviar recordatorio.`);
            const recordatorios = [];
            const telefonos: string[] = [];
            for (const cita of citasPendientes) {
                const paciente = cita.tratamiento.paciente;
                if (paciente.telefono) {
                    telefonos.push(paciente.telefono.toString());
                    recordatorios.push({
                        telefono: paciente.telefono.toString(),
                        paciente: paciente.nombre,
                        fecha: cita.fecha_programada.toDateString(),
                        hora: cita.fecha_programada.toLocaleTimeString(),
                        tipo: cita.tipo.descripcion,
                    });
                }
            }
            if (recordatorios.length > 0) {
                await this.n8nService.enviarRecordatorioCita(telefonos, recordatorios);
                this.logger.log(`Se enviaron ${recordatorios.length} recordatorios de cita.`);
            }
            const result = {
                totalCitas: citasPendientes.length,
                recordatoriosEnviados: recordatorios,
            };
            this.logger.log('Proceso de envío de recordatorios de cita finalizado.');
            return result;
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al enviar recordatorios de cita',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findAll(): Promise<Cita[]> {
        try {
            return await this.citaRepository.find({
                relations: {
                    tratamiento: { paciente: true },
                    estado: true,
                    tipo: true,
                    user: true
                },
            });
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener citas',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findOne(id: string): Promise<Cita> {
        try {
            return await this.citaRepository.findOne({ 
                where: { id },
                relations: {
                    estado: true,
                    tipo: true,
                },
            });
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener cita',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findByPaciente(pacienteId: string): Promise<Cita[]> {
        try {
            return await this.citaRepository.find({
                where: { tratamiento: { paciente: { id: pacienteId } } },
                relations: {
                    tratamiento: { paciente: true },
                    estado: true,
                    tipo: true,
                    user: true
                },
            });
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

    async findByTratamiento(tratamientoId: string): Promise<Cita[]> {
        try {
            return await this.citaRepository.find({
                where: { tratamiento: { id: tratamientoId } },
                relations: {
                    tratamiento: true,
                    tipo: true,
                    estado: true,
                },
            });
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener citas del tratamiento',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getEstadosCita(): Promise<Estado_Cita[]> {
        try {
            return await this.estadoCitaRepository.find();
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener estados de cita',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getEstadoCitaByDescription(description: string): Promise<Estado_Cita> {
        try {
            return await this.estadoCitaRepository.findOne({ where: { descripcion: description } });
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener estado de cita por descripción',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getTipoCitaByDescription(description: string): Promise<Tipo_Cita> {
        try {
            return await this.tipoCitaRepository.findOne({ where: { descripcion: description } });
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener tipo de cita por descripción',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getEstadoCitaById(id: string): Promise<Estado_Cita> {
        try {
            return await this.estadoCitaRepository.findOne({ where: { id } });
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener estado de cita',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getMotivoById(id: string): Promise<Motivo> {
        try {
            return await this.motivoRepository.findOne({ where: { id } });
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener motivo',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getTiposCita(): Promise<Tipo_Cita[]> {
        try {
            return await this.tipoCitaRepository.find();
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener tipos de cita',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getMotivos(): Promise<Motivo[]> {
        try {
            return await this.motivoRepository.find();
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener motivos',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async createMotivo(createMotivoDto: CreateMotivoDto): Promise<Motivo> {
        try {
            const exists = await this.motivoRepository.findOne({ where: { descripcion: createMotivoDto.descripcion } });
            if (exists) {
                throw new HttpException(
                    {
                        success: false,
                        message: 'Motivo ya existe',
                        data: null,
                        error: 'Motivo ya existe',
                    },
                    HttpStatus.BAD_REQUEST,
                );
            }
            const motivoEntity = this.motivoRepository.create(createMotivoDto as any);
            const saved = await this.motivoRepository.save(motivoEntity as any);
            return saved;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al crear motivo',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async updateMotivo(id: string, updateMotivoDto: UpdateMotivoDto): Promise<Motivo> {
        try {
            const existing = await this.motivoRepository.preload({ id, ...updateMotivoDto });
            if (!existing) {
                throw new HttpException(
                    {
                        success: false,
                        message: 'Motivo no encontrado',
                        data: null,
                        error: 'Motivo no encontrado',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }
            const saved = await this.motivoRepository.save(existing);
            return saved;
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al actualizar motivo',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getTipoCitaById(id: string): Promise<Tipo_Cita> {
        try {
            return await this.tipoCitaRepository.findOne({ where: { id } });
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener tipo de cita',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async create(
        cita: CreateCitaDto, 
        tratamiento: TratamientoTB, 
        tipoCita: Tipo_Cita, 
        estadoCita: Estado_Cita, 
        motivo: Motivo, 
        user: User): Promise<Cita> {
        try {
            const newCita = this.citaRepository.create(cita);
            newCita.estado = estadoCita;
            newCita.tipo = tipoCita;
            newCita.tratamiento = tratamiento;
            if(motivo) newCita.motivo = motivo;

            if (estadoCita.descripcion === 'Perdido') {
                this.tratamientoService.aumentarUnDiaFechaFinTratamiento(tratamiento.id);
            }

            return await this.citaRepository.save(newCita);
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al crear cita',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async createTipoCita(tipoCita: any): Promise<Tipo_Cita> {
        try {
            return await this.tipoCitaRepository.save(tipoCita);
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al crear tipo de cita',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async createEstadoCita(estadoCita: any): Promise<Estado_Cita> {
        try {
            return await this.estadoCitaRepository.save(estadoCita);
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al crear estado de cita',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async update(id: string, cita: UpdateCitaDto, tratamiento: TratamientoTB, tipoCita: Tipo_Cita, estadoCita: Estado_Cita, user: User): Promise<Cita> {
        try {
            const existingCita = await this.citaRepository.preload({
                id,
                ...cita,
                tratamiento,
                tipo: tipoCita,
                estado: estadoCita,
                user
            })
            if(!existingCita){
                throw new HttpException(
                    {
                        success: false,
                        message: 'Cita no encontrada',
                        data: null,
                        error: 'Not Found',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }

            switch (estadoCita.descripcion) {
                case 'Perdido':
                    this.tratamientoService.aumentarUnDiaFechaFinTratamiento(tratamiento.id);    
                    break;

                case 'Asistio':
                    const estadoProgramado = await this.getEstadoCitaByDescription('Programado');
                    const tipoCitaProgramacion = await this.getTipoCitaByDescription('Revisión médica');
                    this.programarCitaDiaSiguiente(cita.fecha_programada, tratamiento, user, tipoCitaProgramacion, estadoProgramado);
                    break;
            
                default:
                    break;
            }
            return this.citaRepository.save(existingCita);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al actualizar la cita',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async updateCitaAssistant(idCita: string, fechaProgramada: Date, observacion: string, user: User, estadoCita: Estado_Cita): Promise<Cita> {
        try {
            const existingCita = await this.citaRepository.preload({
                id: idCita,
                fecha_programada: fechaProgramada,
                observaciones: observacion,
                estado: estadoCita,
                user: user,
            })
            if(!existingCita){
                throw new HttpException(
                    {
                        success: false,
                        message: 'Cita no encontrada',
                        data: null,
                        error: 'Not Found',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }
            return this.citaRepository.save(existingCita);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al actualizar la cita del asistente',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
       
    // Crea una nueva cita para el día siguiente de la misma hora
    async programarCitaDiaSiguiente(fecha_programada_ant: Date, tratamiento: TratamientoTB, user: User, tipoCita: Tipo_Cita, estadoCita: Estado_Cita): Promise<Cita> {
        try {
            const nuevaCita = this.citaRepository.create({
                tratamiento: tratamiento,
                fecha_actual: new Date(),
                fecha_programada: fecha_programada_ant.getDate() + 1,
                tipo: tipoCita,
                estado: estadoCita,
                observaciones: 'Ninguna',
                user: user,
            });
            return this.citaRepository.save(nuevaCita);
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al programar cita para el día siguiente',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async updateEstadoCita(id: string, estadoCita: any): Promise<Estado_Cita> {
        try {
            const existingEstado = await this.estadoCitaRepository.preload({
                id,
                ...estadoCita
            })
            if(!existingEstado){
                throw new HttpException(
                    {
                        success: false,
                        message: 'Estado de Cita no encontrado',
                        data: null,
                        error: 'Not Found',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }
            return this.estadoCitaRepository.save(existingEstado);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al actualizar estado de cita',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async updateTipoCita(id: string, tipoCita: any): Promise<Tipo_Cita> {
        try {
            const existingTipo = await this.tipoCitaRepository.preload({
                id,
                ...tipoCita
            })
            if(!existingTipo){
                throw new HttpException(
                    {
                        success: false,
                        message: 'Tipo de Cita no encontrado',
                        data: null,
                        error: 'Not Found',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }
            return this.tipoCitaRepository.save(existingTipo);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al actualizar tipo de cita',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}