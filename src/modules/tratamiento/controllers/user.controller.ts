import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { IApiResponse } from "src/common/interface/api-response.interface";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { UserService } from "../services/user.service";
import { CreateRolDto } from "../dto/create-rol.dto";
import { UpdateRolDto } from "../dto/update-rol.dto";


@Controller('user')
export class UserController {

    constructor(
        private userService: UserService,
    ){}

    @Get('rol')
    async getRols(): Promise<IApiResponse>{
        const rols = await this.userService.getRols();
        return {
            statusCode: 200,
            message: 'Roles encontrados',
            data: rols,
            error: null
        }
    }

    @Get()
    async findAll(): Promise<IApiResponse>{
        const users = await this.userService.findAll();
        return {
            statusCode: 200,
            message: 'Usuarios encontrados',
            data: users,
            error: null
        }
    }
    
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<IApiResponse>{
        const user = await this.userService.findOne(id);
        if(!user){
            return {
                statusCode: 404,
                message: 'Usuario no encontrado',
                data: null,
                error: null
            }
        }
        return {
            statusCode: 200,
            message: 'Usuario encontrado',
            data: user,
            error: null
        }
    }

    @Get('rol/:id')
    async getRolById(@Param('id') id: string): Promise<IApiResponse>{
        const rol = await this.userService.getRolById(id);
        if(!rol){
            return {
                statusCode: 404,
                message: 'Rol no encontrado',
                data: null,
                error: null
            }
        }
        return {
            statusCode: 200,
            message: 'Rol encontrado',
            data: rol,
            error: null
        }
    }

    @Post('rol')
    async createRol(@Body() rol: CreateRolDto): Promise<IApiResponse>{
        const newRol = await this.userService.createRol(rol);
        return {
            statusCode: 201,
            message: 'Rol creado',
            data: newRol,
            error: null
        }
    }

    @Post()
    async create(@Body() user: CreateUserDto): Promise<IApiResponse>{
        const rol = await this.userService.getRolById(user.idRol);
        const newUser = await this.userService.create(user, rol);
        return {
            statusCode: 201,
            message: 'Usuario creado',
            data: newUser,
            error: null
        }
    }

    @Put('rol/:id')
    async updateRol(@Param('id') id: string, @Body() rol: UpdateRolDto): Promise<IApiResponse>{
        const updatedRol = await this.userService.updateRol(id, rol);
        return {
            statusCode: 200,
            message: 'Rol actualizado',
            data: updatedRol,
            error: null
        }
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() user: UpdateUserDto): Promise<IApiResponse>{
        const rol = await this.userService.getRolById(user.idRol);
        const updatedUser = await this.userService.update(id, user, rol);
        return {
            statusCode: 200,
            message: 'Usuario actualizado',
            data: updatedUser,
            error: null
        }
    }

}