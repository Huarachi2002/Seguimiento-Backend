import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
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

    async getUserAdmin(): Promise<User> {
        return this.userRepository.findOne({
            where: { rol: { descripcion: 'Admin' } }
        });
    }

    async findByName(name: string): Promise<User> {
        return this.userRepository.findOneBy({ username: name });
    }

    async getRols(): Promise<Rol[]> {
        return this.rolRepository.find();
    }

    async getUsersByNotificationEmail(): Promise<User[]> {
        return this.userRepository.find({ where: { notificar_email: true } });
    }

    async getUsersByNotificationWhatsapp(): Promise<User[]> {
        return this.userRepository.find({ where: { notificar_whatsapp: true } });
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