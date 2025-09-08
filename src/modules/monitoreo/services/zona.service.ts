import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Zona_Mza } from "../entities/zona_mza.entity";
import { Zona_Uv } from "../entities/zona_uv.entity";
import { CreateZonaMzaDto } from "../dto/create-zona-mza.dto";
import { CreateZonaUvDto } from "../dto/create-zona-uv.dto";
import { UpdateZonaMzaDto } from "../dto/update-zona-mza.dto";
import { UpdateZonaUvDto } from "../dto/update-zona-uv.dto";


@Injectable()
export class ZonaService {

    constructor(
        @InjectRepository(Zona_Mza) private zonaMzaRepository: Repository<Zona_Mza>,
        @InjectRepository(Zona_Uv) private zonaUvRepository: Repository<Zona_Uv>
    ) { }

    async findAllMzas(): Promise<Zona_Mza[]> {
        return this.zonaMzaRepository.find();
    }

    async findAllUvs(): Promise<Zona_Uv[]> {
        return this.zonaUvRepository.find();
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

    async updateMza(id: string, zonaMza: UpdateZonaMzaDto, zonaUv: Zona_Uv): Promise<void> {
        const newZonaMza = this.zonaMzaRepository.create(zonaMza);
        newZonaMza.zona_uv = zonaUv;
        await this.zonaMzaRepository.update(id, newZonaMza);
    }

    async updateUv(id: string, zonaUv: UpdateZonaUvDto): Promise<void> {
        await this.zonaUvRepository.update(id, zonaUv);
    }
}