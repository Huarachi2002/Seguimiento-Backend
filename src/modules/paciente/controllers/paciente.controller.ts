import { Body, Controller, Get, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { CreatePacienteDto } from "../dto/create-paciente.dto";
import { UpdatePacienteDto } from "../dto/update-paciente.dto";
import { PacienteService } from "../services/paciente.service";
import { IApiResponse } from "src/common/interface/api-response.interface";
import { CreateContactoDto } from "../dto/create-contacto.dto";
import { CreateTipoParentescoDto } from "../dto/create-tipo-parentesco.dto";
import { UpdateTipoParentescoDto } from "../dto/update-tipo-parentesco.dto";


@Controller('paciente')
export class PacienteController {

    constructor(
        private pacienteService: PacienteService
    ){}

    @Get()
    async getPacientes(): Promise<IApiResponse> {
        const data = await this.pacienteService.findAll();
        return {
            statusCode: HttpStatus.OK,
            message: 'Lista de pacientes',
            data
        };
    }
    
    @Get('tipo-parentesco')
    async getTipoParentescos(): Promise<IApiResponse> {
        const data = await this.pacienteService.getTipoParentescos();
        return {
            statusCode: HttpStatus.OK,
            message: 'Lista de tipos de parentesco',
            data
        };
    }

    @Get(':id')
    async getPacienteById(@Param('id') id: string) {
        const data = await this.pacienteService.findOne(id);
        if(!data){
            return {
                statusCode: HttpStatus.NOT_FOUND,
                message: 'Paciente no encontrado',
                data: null
            };
        }
        return {
            statusCode: HttpStatus.OK,
            message: 'Detalles del paciente',
            data
        };
    }

    @Get('contacto/:idPaciente')
    async getContactosByPaciente(@Param('idPaciente') id: string): Promise<IApiResponse> {
        const data = await this.pacienteService.findContactosByPaciente(id);
        return {
            statusCode: HttpStatus.OK,
            message: 'Lista de contactos del paciente',
            data
        };
    }



    @Get('tipo-parentesco/:id')
    async getTipoParentescoById(@Param('id') id: string): Promise<IApiResponse> {
        const data = await this.pacienteService.findTipoParentescoById(id);
        if(!data){
            return {
                statusCode: HttpStatus.NOT_FOUND,
                message: 'Tipo de parentesco no encontrado',
                data: null
            };
        }
        return {
            statusCode: HttpStatus.OK,
            message: 'Detalles del tipo de parentesco',
            data
        };
    }

    @Post()
    async createPaciente(@Body() createPacienteDto: CreatePacienteDto) {
        const data = await this.pacienteService.create(createPacienteDto);
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Paciente creado',
            data
        };
    }

    @Post('tipo-parentesco')
    async createTipoParentesco(@Body() createTipoParentescoDto: CreateTipoParentescoDto): Promise<IApiResponse> {
        const data = await this.pacienteService.createTipoParentesco(createTipoParentescoDto);
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Tipo de parentesco creado',
            data
        };
    }

    @Post('contacto/:idPaciente')
    async createContactoForPaciente(@Param('idPaciente') idPaciente: string, @Body() createContactoDto: CreateContactoDto): Promise<IApiResponse> {
        const paciente = await this.pacienteService.findOne(idPaciente);
        if (!paciente) {
            return {
                statusCode: HttpStatus.NOT_FOUND,
                message: 'Paciente no encontrado',
                data: null
            };
        }
        const tipoParentesco = await this.pacienteService.findTipoParentescoById(createContactoDto.id_tipo_parentesco);
        if (!tipoParentesco) {
            return {
                statusCode: HttpStatus.NOT_FOUND,
                message: 'Tipo de parentesco no encontrado',
                data: null
            };
        }
        const contacto = await this.pacienteService.createContactoForPaciente(createContactoDto, paciente, tipoParentesco);
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Contacto creado para el paciente',
            data: contacto
        };
    }    

    @Put(':id')
    async updatePaciente(@Param('id') id: string, @Body() updatePacienteDto: UpdatePacienteDto) {
        const data = await this.pacienteService.update(id, updatePacienteDto);
        return {
            statusCode: HttpStatus.OK,
            message: 'Paciente actualizado',
            data
        };
    }

    @Put('contacto/:idContacto')
    async updateContacto(@Param('idContacto') idContacto: string, @Body() updateContactoDto: CreateContactoDto): Promise<IApiResponse> {
        const existingContacto = await this.pacienteService.findContactoById(idContacto);
        if (!existingContacto) {
            return {
                statusCode: HttpStatus.NOT_FOUND,
                message: 'Contacto no encontrado',
                data: null
            };
        }

        const paciente = await this.pacienteService.findOne(updateContactoDto.id_paciente);
        if (!paciente) {
            return {
                statusCode: HttpStatus.NOT_FOUND,
                message: 'Paciente no encontrado',
                data: null
            };
        }
        const tipoParentesco = await this.pacienteService.findTipoParentescoById(updateContactoDto.id_tipo_parentesco);
        if (!tipoParentesco) {
            return {
                statusCode: HttpStatus.NOT_FOUND,
                message: 'Tipo de parentesco no encontrado',
                data: null
            };
        }


        const updatedContacto = await this.pacienteService.updateContacto(idContacto, updateContactoDto, paciente, tipoParentesco);
        return {
            statusCode: HttpStatus.OK,
            message: 'Contacto actualizado',
            data: updatedContacto
        };
    }

    @Put('tipo-parentesco/:id')
    async updateTipoParentesco(@Param('id') id: string, @Body() updateTipoParentescoDto: UpdateTipoParentescoDto): Promise<IApiResponse> {
        const data = await this.pacienteService.updateTipoParentesco(id, updateTipoParentescoDto);
        return {
            statusCode: HttpStatus.OK,
            message: 'Tipo de parentesco actualizado',
            data
        };
    }

}