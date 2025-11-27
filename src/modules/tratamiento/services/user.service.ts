import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
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
        try {
            return await this.userRepository.find({
                relations: {
                    rol: true
                }
            });
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener usuarios',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findOne(id: string): Promise<User> {
        try {
            return await this.userRepository.findOne({ 
                where: { id },
                relations: {
                    rol: true
                }
            });
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener usuario',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getUserAdmin(): Promise<User> {
        try {
            return await this.userRepository.findOne({
                where: { rol: { descripcion: 'Admin' } },
                relations: {
                    rol: true
                }
            });
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener usuario administrador',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findByName(name: string): Promise<User> {
        try {
            return await this.userRepository.findOneBy(
                { username: name },
            );
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al buscar usuario por nombre',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getRols(): Promise<Rol[]> {
        try {
            return await this.rolRepository.find();
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener roles',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getUsersByNotificationEmail(): Promise<User[]> {
        try {
            return await this.userRepository.find({ where: { notificar_email: true } });
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener usuarios con notificación por email',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getUsersByNotificationWhatsapp(): Promise<User[]> {
        try {
            return await this.userRepository.find({ where: { notificar_whatsapp: true } });
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener usuarios con notificación por WhatsApp',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getRolById(id: string): Promise<Rol> {
        try {
            return await this.rolRepository.findOne({ where: { id } });
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al obtener rol',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async createRol(rol: CreateRolDto): Promise<Rol> {
        try {
            const newRol = this.rolRepository.create(rol);
            return await this.rolRepository.save(newRol);
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al crear rol',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async create(user: CreateUserDto, rol: Rol): Promise<User> {
        try {
            const newUser = this.userRepository.create(user);
            newUser.rol = rol;
            return await this.userRepository.save(newUser);
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al crear usuario',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async updateRol(id: string, rol: UpdateRolDto): Promise<Rol> {
        try {
            const existingRol = await this.rolRepository.preload({
                id,
                ...rol
            });
            if(!existingRol){
                throw new HttpException(
                    {
                        success: false,
                        message: 'Rol no encontrado',
                        data: null,
                        error: 'Rol no encontrado',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }
            return await this.rolRepository.save(existingRol);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al actualizar rol',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async update(id: string, user: UpdateUserDto, rol: Rol): Promise<User> {
        try {
            const existingUser = await this.userRepository.preload({
                id,
                ...user,
                rol
            });
            if(!existingUser){
                throw new HttpException(
                    {
                        success: false,
                        message: 'Usuario no encontrado',
                        data: null,
                        error: 'Usuario no encontrado',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }
            return await this.userRepository.save(existingUser);
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al actualizar usuario',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
    
}