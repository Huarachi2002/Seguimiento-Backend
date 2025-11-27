import { forwardRef, Inject, Injectable, HttpException, HttpStatus } from "@nestjs/common";
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
        try {
            return await this.tratamientoRepository.find({
                relations: {
                    paciente: true,
                    tipo_tratamiento: true,
                    estado: true,
                },
            });
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener tratamientos',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findOne(id: string): Promise<TratamientoTB> {
        try {
            return await this.tratamientoRepository.findOne({ where: { id },
                relations: {
                    tipo_tratamiento: true,
                    estado: true,
                    paciente: true,
                }
            });
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener tratamiento',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
    
    async findByPaciente(pacienteId: string): Promise<TratamientoTB[]> {
        try {
            return await this.tratamientoRepository.find({
                where: { paciente: { id: pacienteId } },
                relations: {
                    paciente: true,
                    tipo_tratamiento: true,
                    estado: true
                }
            });
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener tratamientos del paciente',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getTiposTratamiento(): Promise<Tipo_Tratamiento[]> {
        try {
            return await this.tipoTratamientoRepository.find();
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener tipos de tratamiento',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getTipoTratamientoById(id: string): Promise<Tipo_Tratamiento> {
        try {
            return await this.tipoTratamientoRepository.findOne({ where: { id } });
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener tipo de tratamiento',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getEstadosTratamiento(): Promise<Estado_Tratamiento[]> {
        try {
            return await this.estadoTratamientoRepository.find();
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener estados de tratamiento',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getFasesTratamiento(): Promise<Fase_Tratamiento[]> {
        try {
            return await this.tratamientoRepository.manager.find(Fase_Tratamiento);
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener fases de tratamiento',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getLocalizaciones(): Promise<Localizacion_TB[]> {
        try {
            return await this.localizacionRepository.find();
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener localizaciones',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async aumentarUnDiaFechaFinTratamiento(tratamientoId: string): Promise<void> {
        try {
            await this.tratamientoRepository.update(
                { id: tratamientoId },
                { fecha_fin: () => "DATEADD(day, 1, fecha_fin)" }
            );
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al aumentar fecha fin del tratamiento',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getLocalizacionById(id: string): Promise<Localizacion_TB> {
        try {
            return await this.localizacionRepository.findOne({ where: { id } });
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener localización',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
    
    async getEstadoTratamientoById(id: string): Promise<Estado_Tratamiento> {
        try {
            return await this.estadoTratamientoRepository.findOne({ where: { id } });
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener estado de tratamiento',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async create(tratamiento: CreateTratamientoDto, tipoTratamiento: Tipo_Tratamiento, estadoTratamiento: Estado_Tratamiento, localizacionTb: Localizacion_TB, paciente: Paciente): Promise<TratamientoTB> {
        try {
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
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al crear tratamiento',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async createTipoTratamiento(tipoTratamiento: CreateTipoTratamientoDto): Promise<Tipo_Tratamiento> {
        try {
            return await this.tipoTratamientoRepository.save(tipoTratamiento);
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al crear tipo de tratamiento',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async createEstadoTratamiento(estadoTratamiento: CreateEstadoTratamientoDto): Promise<Estado_Tratamiento> {
        try {
            return await this.estadoTratamientoRepository.save(estadoTratamiento);
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al crear estado de tratamiento',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async update(id: string, tratamiento: UpdateTratamientoDto, tipoTratamiento: Tipo_Tratamiento, estadoTratamiento: Estado_Tratamiento): Promise<TratamientoTB> {
        try {
            const existingTratamiento = await this.tratamientoRepository.preload({
                id,
                ...tratamiento,
                tipo_tratamiento: tipoTratamiento,
                estado: estadoTratamiento
            });
            if(!existingTratamiento){
                throw new HttpException(
                    {
                        success: false,
                        message: 'Tratamiento no encontrado',
                        data: null,
                        error: 'Tratamiento no encontrado',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }
            return await this.tratamientoRepository.save(existingTratamiento);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al actualizar tratamiento',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async updateTipoTratamiento(id: string, tipoTratamiento: UpdateTipoTratamientoDto): Promise<Tipo_Tratamiento> {
        try {
            const existingTipo = await this.tipoTratamientoRepository.preload({
                id,
                ...tipoTratamiento
            });
            if(!existingTipo){
                throw new HttpException(
                    {
                        success: false,
                        message: 'Tipo de Tratamiento no encontrado',
                        data: null,
                        error: 'Tipo de Tratamiento no encontrado',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }
            return await this.tipoTratamientoRepository.save(existingTipo);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al actualizar tipo de tratamiento',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async updateEstadoTratamiento(id: string, estadoTratamiento: CreateEstadoTratamientoDto): Promise<Estado_Tratamiento> {
        try {
            const existingEstado = await this.estadoTratamientoRepository.preload({
                id,
                ...estadoTratamiento
            });
            if(!existingEstado){
                throw new HttpException(
                    {
                        success: false,
                        message: 'Estado de Tratamiento no encontrado',
                        data: null,
                        error: 'Estado de Tratamiento no encontrado',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }
            return await this.estadoTratamientoRepository.save(existingEstado);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al actualizar estado de tratamiento',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
    
}