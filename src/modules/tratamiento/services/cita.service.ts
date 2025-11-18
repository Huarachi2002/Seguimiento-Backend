import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
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
        // Lógica para enviar recordatorio de cita usando N8N u otro servicio
        this.logger.log('Iniciando proceso de envío de recordatorios de cita...');
        const now = new Date();
        const threeHoursLater = new Date(now.getTime() + 3 * 60 * 60 * 1000);
        
        const citasPendientes = await this.citaRepository
            .createQueryBuilder('cita')
            .leftJoinAndSelect('cita.tratamiento', 'tratamiento')
            .leftJoinAndSelect('tratamiento.paciente', 'paciente')
            .leftJoinAndSelect('cita.estado', 'estado')
            .leftJoinAndSelect('cita.tipo', 'tipo') 
            .where('cita.fecha_programada BETWEEN :now AND :threeHoursLater', {
            now,
            threeHoursLater
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
    }

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
        return this.citaRepository.findOne({ 
            where: { id },
            relations: {
                estado: true,
                tipo: true,
            },
        });
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

    async getEstadoCitaByDescription(description: string): Promise<Estado_Cita> {
        return this.estadoCitaRepository.findOne({ where: { descripcion: description } });
    }

    async getTipoCitaByDescription(description: string): Promise<Tipo_Cita> {
        return this.tipoCitaRepository.findOne({ where: { descripcion: description } });
    }

    async getEstadoCitaById(id: string): Promise<Estado_Cita> {
        return this.estadoCitaRepository.findOne({ where: { id } });
    }

    async getMotivoById(id: string): Promise<Motivo> {
        return this.motivoRepository.findOne({ where: { id } });
    }

    async getTiposCita(): Promise<Tipo_Cita[]> {
        return this.tipoCitaRepository.find();
    }

    async getMotivos(): Promise<Motivo[]> {
        return this.motivoRepository.find();
    }

    async createMotivo(createMotivoDto: CreateMotivoDto): Promise<Motivo> {
        const exists = await this.motivoRepository.findOne({ where: { descripcion: createMotivoDto.descripcion } });
        if (exists) throw new Error('Motivo ya existe');
    const motivoEntity = this.motivoRepository.create(createMotivoDto as any);
    const saved = await this.motivoRepository.save(motivoEntity as any);
        return saved;
    }

    async updateMotivo(id: string, updateMotivoDto: UpdateMotivoDto): Promise<Motivo> {
        const existing = await this.motivoRepository.preload({ id, ...updateMotivoDto });
        if (!existing) throw new Error('Motivo no encontrado');
        const saved = await this.motivoRepository.save(existing);
        return saved;
    }

    async getTipoCitaById(id: string): Promise<Tipo_Cita> {
        return this.tipoCitaRepository.findOne({ where: { id } });
    }

    async create(
        cita: CreateCitaDto, 
        tratamiento: TratamientoTB, 
        tipoCita: Tipo_Cita, 
        estadoCita: Estado_Cita, 
        motivo: Motivo, 
        user: User): Promise<Cita> {

        const newCita = this.citaRepository.create(cita);
        newCita.estado = estadoCita;
        newCita.tipo = tipoCita;
        newCita.tratamiento = tratamiento;
        if(motivo) newCita.motivo = motivo;
        // newCita.user = user;

        if (estadoCita.descripcion === 'Perdido')
        {
            this.tratamientoService.aumentarUnDiaFechaFinTratamiento(tratamiento.id);
        }

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
    }

    async updateCitaAssistant(idCita: string, fechaProgramada: Date, observacion: string, user: User, estadoCita: Estado_Cita): Promise<Cita> {
        const existingCita = await this.citaRepository.preload({
            id: idCita,
            fecha_programada: fechaProgramada,
            observaciones: observacion,
            estado: estadoCita,
            user: user,
        })
        if(!existingCita){
            throw new Error('Cita no encontrada');
        }
        return this.citaRepository.save(existingCita);
    }
       
    // Crea una nueva cita para el día siguiente de la misma hora
    async programarCitaDiaSiguiente(fecha_programada_ant: Date, tratamiento: TratamientoTB, user: User, tipoCita: Tipo_Cita, estadoCita: Estado_Cita): Promise<Cita> {
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