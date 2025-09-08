import { Body, Controller, Get, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { UpdatePacienteDto } from "../dto/update-paciente.dto";
import { PacienteService } from "../services/paciente.service";
import { IApiResponse } from "src/common/interface/api-response.interface";
import { ContactoService } from "../services/contacto.service";
import { CreateContactoDto } from "../dto/create-contacto.dto";
import { TipoParentescoService } from "../services/tipo_parentesco.service";
import { UpdateContactoDto } from "../dto/update-contacto.dto";


@Controller('contacto')
export class ContactoController {

    constructor(
        private pacienteService: PacienteService,
        private contactoService: ContactoService,
        private tipoParentescoService: TipoParentescoService
    ){}

    @Get(':idPaciente')
    getContactoByPaciente(@Param('idPaciente') id: string): Promise<IApiResponse> {
        const paciente = this.pacienteService.findOne(id)
        if (!paciente) {
            return Promise.resolve({
                statusCode: HttpStatus.NOT_FOUND,
                message: 'Paciente no encontrado',
                data: null
            });
        }

        return this.contactoService.findByPaciente(id).then(data => ({
            statusCode: HttpStatus.OK,
            message: 'Contactos del paciente',
            data
        }));
    }

    @Post()
    async createContacto(@Body() createContactoDto: CreateContactoDto) {
        const paciente = await this.pacienteService.findOne(createContactoDto.id_paciente);
        if (!paciente) {
            return Promise.resolve({
                statusCode: HttpStatus.NOT_FOUND,
                message: 'Paciente no encontrado',
                data: null
            });
        }
        const tipo_parentesco = await this.tipoParentescoService.findOne(createContactoDto.id_tipo_parentesco);
        if (!tipo_parentesco) {
            return Promise.resolve({
                statusCode: HttpStatus.NOT_FOUND,
                message: 'Tipo de parentesco no encontrado',
                data: null
            });
        }
        return this.contactoService.create(createContactoDto, paciente, tipo_parentesco).then(data => ({
            statusCode: HttpStatus.CREATED,
            message: 'Contacto creado',
            data
        }));
    }

    @Put(':id')
    async updateContacto(@Param('id') id: string, @Body() updateContactoDto: UpdateContactoDto): Promise<IApiResponse> {
        const paciente = await this.pacienteService.findOne(updateContactoDto.id_paciente);
        if (!paciente) {
            return Promise.resolve({
                statusCode: HttpStatus.NOT_FOUND,
                message: 'Paciente no encontrado',
                data: null
            });
        }
        const tipo_parentesco = await this.tipoParentescoService.findOne(updateContactoDto.id_tipo_parentesco);
        if (!tipo_parentesco) {
            return Promise.resolve({
                statusCode: HttpStatus.NOT_FOUND,
                message: 'Tipo de parentesco no encontrado',
                data: null
            });
        }

        await this.contactoService.update(id, updateContactoDto, paciente, tipo_parentesco);
        return {
            statusCode: HttpStatus.OK,
            message: 'Contacto actualizado',
            data: null
        };
    }

}