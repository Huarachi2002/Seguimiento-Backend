import { Injectable, Inject, forwardRef, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Direccion } from "../entities/direccion.entity";
import { CreateDireccionDto } from "../dto/create-direccion.dto";
import { UpdateDireccionDto } from "../dto/update-direccion.dto";
import { Paciente } from "@/modules/paciente/entities/paciente.entity";
import { Zona_Mza } from "../entities/zona_mza.entity";
import { Zona_Uv } from "../entities/zona_uv.entity";
import { UpdateZonaUvDto } from "../dto/update-zona-uv.dto";
import { UpdateZonaMzaDto } from "../dto/update-zona-mza.dto";
import { CreateZonaUvDto } from "../dto/create-zona-uv.dto";
import { CreateZonaMzaDto } from "../dto/create-zona-mza.dto";
import { PacienteService } from "@/modules/paciente/services/paciente.service";


@Injectable()
export class DireccionService {

    constructor(
        @InjectRepository(Direccion) private direccionRepository: Repository<Direccion>,
        @InjectRepository(Zona_Mza) private zonaMzaRepository: Repository<Zona_Mza>,
        @InjectRepository(Zona_Uv) private zonaUvRepository: Repository<Zona_Uv>,

        @Inject(forwardRef(() => PacienteService))
        private pacienteService: PacienteService,
    ) { }

    async findOne(id: string): Promise<Direccion> {
        try {
            return await this.direccionRepository.findOneBy({ id });
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener dirección',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findPacienteById(idPaciente: string): Promise<Paciente> {
        try {
            return await this.pacienteService.findOne(idPaciente);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
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

    async findOneByPaciente(idPaciente: string): Promise<Direccion> {
        try {
            //NOTE: devolver objetos relacionados
            return await this.direccionRepository.findOne({ 
                where:{ paciente: { id: idPaciente } },
                relations: {zona:true}
            });
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

    async create(direccion: CreateDireccionDto, paciente: Paciente): Promise<Direccion> {
        try {
            const newDireccion = this.direccionRepository.create({
                descripcion: direccion.descripcion,
                nro_casa: direccion.nro_casa,
                latitud: direccion.latitud,
                longitud: direccion.longitud,
                zona: { id: direccion.idMza },
                paciente,
            });
            
            return await this.direccionRepository.save(newDireccion);
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al crear dirección',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async update(id: string, direccion: UpdateDireccionDto): Promise<Direccion> {
        try {
            //NOTE: no se actualizaban las relaciones
            const preloadData = {
                id,
                descripcion: direccion.descripcion,
                nro_casa: direccion.nro_casa,
                latitud: direccion.latitud,
                longitud: direccion.longitud,
                paciente: { id: direccion.idPaciente }, 
                zona: { id: direccion.idMza }           
            };
            const existingDireccion = await this.direccionRepository.preload(preloadData)
            if(!existingDireccion){
                throw new HttpException(
                    {
                        success: false,
                        message: 'Dirección no encontrada',
                        data: null,
                        error: 'Not Found',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }
            return await this.direccionRepository.save(existingDireccion);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al actualizar dirección',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findAllMzas(): Promise<Zona_Mza[]> {
        try {
            return await this.zonaMzaRepository.find();
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener zonas MZA',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findAllUvs(): Promise<Zona_Uv[]> {
        try {
            return await this.zonaUvRepository.find();
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener zonas UV',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findMzasByZonaUv(idZonaUv: string): Promise<Zona_Mza[]> {
        try {
            return await this.zonaMzaRepository.find({
                where: {
                    zona_uv: { id: idZonaUv }
                }
            });
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener MZAs por zona UV',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findMzaById(id: string): Promise<Zona_Mza> {
        try {
            return await this.zonaMzaRepository.findOne({
                where: { id },
                relations: ['zona_uv']
            });
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener zona MZA',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findUvById(id: string): Promise<Zona_Uv> {
        try {
            return await this.zonaUvRepository.findOne({
                where: { id },
                relations: ['zona_mza']
            });
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener zona UV',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async createMza(zonaMza: CreateZonaMzaDto, zonaUv: Zona_Uv): Promise<Zona_Mza> {
        try {
            const newZonaMza = this.zonaMzaRepository.create(zonaMza);
            newZonaMza.zona_uv = zonaUv;
            return await this.zonaMzaRepository.save(newZonaMza);
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al crear zona MZA',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async createUv(zonaUv: CreateZonaUvDto): Promise<Zona_Uv> {
        try {
            const newZonaUv = this.zonaUvRepository.create(zonaUv);
            return await this.zonaUvRepository.save(newZonaUv);
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al crear zona UV',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async updateMza(id: string, zonaMza: UpdateZonaMzaDto, zonaUv: Zona_Uv): Promise<Zona_Mza> {
        try {
            const existingZonaMza = await this.zonaMzaRepository.preload({
                id,
                ...zonaMza,
                zona_uv: zonaUv
            })
            if(!existingZonaMza){
                throw new HttpException(
                    {
                        success: false,
                        message: 'Zona MZA no encontrada',
                        data: null,
                        error: 'Not Found',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }
            return await this.zonaMzaRepository.save(existingZonaMza);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al actualizar zona MZA',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async updateUv(id: string, zonaUv: UpdateZonaUvDto): Promise<Zona_Uv> {
        try {
            const existingZonaUv = await this.zonaUvRepository.preload({
                id,
                ...zonaUv
            })
            if(!existingZonaUv){
                throw new HttpException(
                    {
                        success: false,
                        message: 'Zona UV no encontrada',
                        data: null,
                        error: 'Not Found',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }
            return await this.zonaUvRepository.save(existingZonaUv);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al actualizar zona UV',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}