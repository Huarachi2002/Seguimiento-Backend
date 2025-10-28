import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TratamientoTB } from "../entities/tratamientoTB.entity";
import { Repository } from "typeorm";
import { CreateTratamientoDto } from "../dto/create-tratamiento.dto";
import { UpdateTratamientoDto } from "../dto/update-tratamiento.dto";
import { Cita } from "../entities/cita.entity";
import { Tipo_Cita } from "../entities/tipo_cita.entity";
import { Estado_Tratamiento } from "../entities/estado_tratamiento.entity";
import { User } from "../entities/user.entity";
import { CreateUserDto } from "../dto/create-user.dto";
import { Rol } from "../entities/rol.entity";
import { UpdateUserDto } from "../dto/update-user.dto";
import { CreateRolDto } from "../dto/create-rol.dto";
import { UpdateRolDto } from "../dto/update-rol.dto";


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Rol) private rolRepository: Repository<Rol>,
    ) {}

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOne(id: string): Promise<User> {
        return this.userRepository.findOne({ where: { id } });
    }

    async findByName(name: string): Promise<User> {
        return this.userRepository.findOneBy({ username: name });
    }

    async getRols(): Promise<Rol[]> {
        return this.rolRepository.find();
    }

    async getRolById(id: string): Promise<Rol> {
        return this.rolRepository.findOne({ where: { id } });
    }

    async createRol(rol: CreateRolDto): Promise<Rol> {
        const newRol = this.rolRepository.create(rol);
        return this.rolRepository.save(newRol);
    }

    async create(user: CreateUserDto, rol: Rol): Promise<User> {
        const newUser = this.userRepository.create(user);
        newUser.rol = rol;
        return this.userRepository.save(newUser);
    }

    async updateRol(id: string, rol: UpdateRolDto): Promise<Rol> {
        const existingRol = await this.rolRepository.preload({
            id,
            ...rol
        })
        if(!existingRol){
            throw new Error('Rol no encontrado');
        }
        return this.rolRepository.save(existingRol);
    }

    async update(id: string, user: UpdateUserDto, rol: Rol): Promise<User> {
        const existingUser = await this.userRepository.preload({
            id,
            ...user,
            rol
        })
        if(!existingUser){
            throw new Error('Usuario no encontrado');
        }
        return this.userRepository.save(existingUser);
    }
    
}