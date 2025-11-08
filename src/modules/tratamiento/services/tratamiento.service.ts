import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TratamientoTB } from "../entities/tratamientoTB.entity";
import { In, Repository } from "typeorm";
import { CreateTratamientoDto } from "../dto/create-tratamiento.dto";
import { Tipo_Tratamiento } from "../entities/tipo_tratamiento.entity";
import { Estado_Tratamiento } from "../entities/estado_tratamiento.entity";
import { UpdateTratamientoDto } from "../dto/update-tratamiento.dto";
import { CreateTipoTratamientoDto } from "../dto/create-tipo-tratamiento.dto";
import { CreateEstadoTratamientoDto } from "../dto/create-estado-tratamiento.dto";
import { UpdateTipoTratamientoDto } from "../dto/update-tipo-tratamiento.dto";
import { Fase_Tratamiento } from "../entities/fase_tratamiento.entity";
import { Paciente } from "@/modules/paciente/entities/paciente.entity";
import { Localizacion_TB } from "../entities/localizacion_tb.entity";
import { Cita } from "../entities/cita.entity";
import { CitaService } from "./cita.service";
import { UserService } from "./user.service";


@Injectable()
export class TratamientoService {
    constructor(
        @InjectRepository(TratamientoTB) private tratamientoRepository: Repository<TratamientoTB>,
        @InjectRepository(Tipo_Tratamiento) private tipoTratamientoRepository: Repository<Tipo_Tratamiento>,
        @InjectRepository(Estado_Tratamiento) private estadoTratamientoRepository: Repository<Estado_Tratamiento>,
        @InjectRepository(Localizacion_TB) private localizacionRepository: Repository<Localizacion_TB>,
        @InjectRepository(Cita) private citaRepository: Repository<Cita>,

        @Inject(forwardRef(() => CitaService)) private citaService: CitaService,
        @Inject(forwardRef(() => UserService)) private userService: UserService
    ) {}

    async findAll(): Promise<TratamientoTB[]> {
        return this.tratamientoRepository.find({
            relations: {
                paciente: true,
                tipo_tratamiento: true,
                estado: true,
            },
        });
    }

    async findOne(id: string): Promise<TratamientoTB> {
        return this.tratamientoRepository.findOne({ where: { id },
            relations: {
                tipo_tratamiento: true,
                estado: true,
                paciente: true,
            }
        });
    }
    
    async findByPaciente(pacienteId: string): Promise<TratamientoTB[]> {
        return this.tratamientoRepository.find({
            where: { paciente: { id: pacienteId } },
            relations: {
                paciente: true,
                tipo_tratamiento: true,
                estado: true
            }
        });
    }

    async getTiposTratamiento(): Promise<Tipo_Tratamiento[]> {
        return this.tipoTratamientoRepository.find();
    }

    async getTipoTratamientoById(id: string): Promise<Tipo_Tratamiento> {
        return this.tipoTratamientoRepository.findOne({ where: { id } });
    }

    async getEstadosTratamiento(): Promise<Estado_Tratamiento[]> {
        return this.estadoTratamientoRepository.find();
    }

    async getFasesTratamiento(): Promise<Fase_Tratamiento[]> {
        return this.tratamientoRepository.manager.find(Fase_Tratamiento);
    }

    async getLocalizaciones(): Promise<Localizacion_TB[]> {
        return this.localizacionRepository.find();
    }

    async getLocalizacionById(id: string): Promise<Localizacion_TB> {
        return this.localizacionRepository.findOne({ where: { id } });
    }
    
    async getEstadoTratamientoById(id: string): Promise<Estado_Tratamiento> {
        return this.estadoTratamientoRepository.findOne({ where: { id } });
    }

    async create(tratamiento: CreateTratamientoDto, tipoTratamiento: Tipo_Tratamiento, estadoTratamiento: Estado_Tratamiento, localizacionTb: Localizacion_TB, paciente: Paciente): Promise<TratamientoTB> {
        const newTratamiento = this.tratamientoRepository.create(tratamiento);
        newTratamiento.tipo_tratamiento = tipoTratamiento;
        newTratamiento.estado = estadoTratamiento;
        newTratamiento.paciente = paciente;
        newTratamiento.localizacion = localizacionTb;

        const savedTratamiento = await this.tratamientoRepository.save(newTratamiento);

        const fechaInicio = new Date(newTratamiento.fecha_inicio);
        const hoy = new Date()
        hoy.setHours(0,0,0,0);
        
        const userAdmin = await this.userService.getUserAdmin();

        if (fechaInicio < hoy) {
            const estadoCita = await this.citaService.getEstadoCitaByDescription('Perdido');


            const tipoCita = await this.citaService.getTipoCitaByDescription('Revisión médica')

            const diferenciaDias = Math.floor((hoy.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));

            const citasPromises : Promise<Cita>[] = [];

            for (let i = 0; i < diferenciaDias; i++) {
                const fechaCita = new Date(fechaInicio.getTime() + (i * 24 * 60 * 60 * 1000));

                const cita = this.citaRepository.create({
                    tratamiento: savedTratamiento,
                    fecha_actual: fechaCita,
                    fecha_programada: fechaCita,
                    user: userAdmin,
                    tipo: tipoCita,
                    estado: estadoCita,
                    observaciones: 'Cita generada automáticamente por retraso en el tratamiento'
                });

                citasPromises.push(this.citaRepository.save(cita));
            }

            await Promise.all(citasPromises);
        }

        // Programar cita proxima al dia siguiente
        const citaProxima = this.citaRepository.create({
            tratamiento: savedTratamiento,
            fecha_actual: new Date(),
            fecha_programada: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
            tipo: await this.citaService.getTipoCitaByDescription('Revisión médica'),
            user: userAdmin,
            estado: await this.citaService.getEstadoCitaByDescription('Programado'),
            observaciones: 'Ninguna'

        });

        await this.citaRepository.save(citaProxima);

        return savedTratamiento;
    }

    async createTipoTratamiento(tipoTratamiento: CreateTipoTratamientoDto): Promise<Tipo_Tratamiento> {
        return this.tipoTratamientoRepository.save(tipoTratamiento);
    }

    async createEstadoTratamiento(estadoTratamiento: CreateEstadoTratamientoDto): Promise<Estado_Tratamiento> {
        return this.estadoTratamientoRepository.save(estadoTratamiento);
    }

    async update(id: string, tratamiento: UpdateTratamientoDto, tipoTratamiento: Tipo_Tratamiento, estadoTratamiento: Estado_Tratamiento): Promise<TratamientoTB> {
        const existingTratamiento = await this.tratamientoRepository.preload({
            id,
            ...tratamiento,
            tipo_tratamiento: tipoTratamiento,
            estado: estadoTratamiento
        })
        if(!existingTratamiento){
            throw new Error('Tratamiento no encontrado');
        }
        return this.tratamientoRepository.save(existingTratamiento);
    }

    async updateTipoTratamiento(id: string, tipoTratamiento: UpdateTipoTratamientoDto): Promise<Tipo_Tratamiento> {
        const existingTipo = await this.tipoTratamientoRepository.preload({
            id,
            ...tipoTratamiento
        })
        if(!existingTipo){
            throw new Error('Tipo de Tratamiento no encontrado');
        }
        return this.tipoTratamientoRepository.save(existingTipo);
    }

    async updateEstadoTratamiento(id: string, estadoTratamiento: CreateEstadoTratamientoDto): Promise<Estado_Tratamiento> {
        const existingEstado = await this.estadoTratamientoRepository.preload({
            id,
            ...estadoTratamiento
        })
        if(!existingEstado){
            throw new Error('Estado de Tratamiento no encontrado');
        }
        return this.estadoTratamientoRepository.save(existingEstado);
    }
    
}