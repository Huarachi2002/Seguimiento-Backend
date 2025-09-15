import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Direccion } from "../entities/direccion.entity";
import { CreateDireccionDto } from "../dto/create-direccion.dto";
import { UpdateDireccionDto } from "../dto/update-direccion.dto";
import { Paciente } from "src/modules/paciente/entities/paciente.entity";
import { Zona_Mza } from "../entities/zona_mza.entity";
import { Zona_Uv } from "../entities/zona_uv.entity";
import { UpdateZonaUvDto } from "../dto/update-zona-uv.dto";
import { UpdateZonaMzaDto } from "../dto/update-zona-mza.dto";
import { CreateZonaUvDto } from "../dto/create-zona-uv.dto";
import { CreateZonaMzaDto } from "../dto/create-zona-mza.dto";


@Injectable()
export class DireccionService {

    constructor(
        @InjectRepository(Direccion) private direccionRepository: Repository<Direccion>,
        @InjectRepository(Zona_Mza) private zonaMzaRepository: Repository<Zona_Mza>,
        @InjectRepository(Zona_Uv) private zonaUvRepository: Repository<Zona_Uv>
    ) { }

    async findOne(id: string): Promise<Direccion> {
        return this.direccionRepository.findOneBy({ id });
    }

    async findOneByPaciente(idPaciente: string): Promise<Direccion> {
        return this.direccionRepository.findOneBy({ paciente: { id: idPaciente } });
    }

    async create(direccion: CreateDireccionDto, paciente: Paciente): Promise<Direccion> {
        const newDireccion = this.direccionRepository.create(direccion);
        newDireccion.paciente = paciente;
        return this.direccionRepository.save(newDireccion);
    }

    async update(id: string, direccion: UpdateDireccionDto): Promise<Direccion> {
        const existingDireccion = await this.direccionRepository.preload({
            id,
            ...direccion
        })
        if(!existingDireccion){
            throw new Error('Dirección no encontrada');
        }
        return this.direccionRepository.save(existingDireccion);
    }

    async findAllMzas(): Promise<Zona_Mza[]> {
        return this.zonaMzaRepository.find();
    }

    async findAllUvs(): Promise<Zona_Uv[]> {
        return this.zonaUvRepository.find();
    }

    async findMzasByZonaUv(idZonaUv: string): Promise<Zona_Mza[]> {
        return this.zonaMzaRepository.find({
            where: {
                zona_uv: { id: idZonaUv }
            }
        });
    }

    async findMzaById(id: string): Promise<Zona_Mza> {
        return this.zonaMzaRepository.findOneBy({ id });
    }

    async findUvById(id: string): Promise<Zona_Uv> {
        return this.zonaUvRepository.findOneBy({ id });
    }

    async createMza(zonaMza: CreateZonaMzaDto, zonaUv: Zona_Uv): Promise<Zona_Mza> {
        const newZonaMza = this.zonaMzaRepository.create(zonaMza);
        newZonaMza.zona_uv = zonaUv;
        return this.zonaMzaRepository.save(newZonaMza);
    }

    async createUv(zonaUv: CreateZonaUvDto): Promise<Zona_Uv> {
        const newZonaUv = this.zonaUvRepository.create(zonaUv);
        return this.zonaUvRepository.save(newZonaUv);
    }

    async updateMza(id: string, zonaMza: UpdateZonaMzaDto, zonaUv: Zona_Uv): Promise<Zona_Mza> {
        const existingZonaMza = await this.zonaMzaRepository.preload({
            id,
            ...zonaMza,
            zona_uv: zonaUv
        })
        if(!existingZonaMza){
            throw new Error('Zona Mza no encontrada');
        }
        return this.zonaMzaRepository.save(existingZonaMza);
    }

    async updateUv(id: string, zonaUv: UpdateZonaUvDto): Promise<Zona_Uv> {
        const existingZonaUv = await this.zonaUvRepository.preload({
            id,
            ...zonaUv
        })
        if(!existingZonaUv){
            throw new Error('Zona UV no encontrada');
        }
        return this.zonaUvRepository.save(existingZonaUv);
    }
}