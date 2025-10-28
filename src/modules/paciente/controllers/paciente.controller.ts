import { Body, Controller, Get, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { CreatePacienteDto } from "../dto/create-paciente.dto";
import { UpdatePacienteDto } from "../dto/update-paciente.dto";
import { PacienteService } from "../services/paciente.service";
import { IApiResponse } from "src/common/interface/api-response.interface";
import { CreateContactoDto } from "../dto/create-contacto.dto";
import { CreateTipoParentescoDto } from "../dto/create-tipo-parentesco.dto";
import { UpdateTipoParentescoDto } from "../dto/update-tipo-parentesco.dto";
import { DireccionService } from "@/modules/monitoreo/services/direccion.service";
import { CreateEnfermedadDto } from "../dto/create-enfermedad.dto";
import { UpdateEnfermedadDto } from "../dto/update-enfermedad.dto";
import { CreatePacienteEnfermedadDto } from "../dto/create-paciente-enfermedad.dto";
import { CreateSintomaDto } from "../dto/create-sintoma.dto";
import { UpdateSintomaDto } from "../dto/update-sintoma.dto";
import { CreatePacienteSintomaDto } from "../dto/create-paciente-sintoma.dto";


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
    
    @Get('enfermedad')
    async getEnfermedades(): Promise<IApiResponse> {
        const data = await this.pacienteService.getEnfermedades();
        return { statusCode: HttpStatus.OK, message: 'Lista de enfermedades', data };
    }

    @Get('sintoma')
    async getSintomas(): Promise<IApiResponse> {
        const data = await this.pacienteService.getSintomas();
        return { statusCode: HttpStatus.OK, message: 'Lista de sintomas', data };
    }

    @Get(':id')
    async getPacienteById(@Param('id') id: string) {
        const paciente = await this.pacienteService.findOne(id);
        if(!paciente){
            return {
                statusCode: HttpStatus.NOT_FOUND,
                message: 'Paciente no encontrado',
                data: null
            };
        }
        const direccion = await this.pacienteService.findDireccionByPaciente(id);
        const contactos = await this.pacienteService.findContactosByPaciente(id);
        const data = {
            paciente,
            direccion:{...direccion, idMza: direccion?.zona.id},
            contactos 
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
        const paciente = await this.pacienteService.create(createPacienteDto);

        if (createPacienteDto.enfermedades && createPacienteDto.enfermedades.length > 0) {
            await this.pacienteService.addEnfermedadesToPaciente(paciente.id, createPacienteDto.enfermedades);
        }

        if (createPacienteDto.sintomas && createPacienteDto.sintomas.length > 0) {
            await this.pacienteService.addSintomasToPaciente(paciente.id, createPacienteDto.sintomas);
        }

        return {
            statusCode: HttpStatus.CREATED,
            message: 'Paciente creado',
            data: paciente
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

    // Enfermedades - catalogo
    

    @Post('enfermedad')
    async createEnfermedad(@Body() dto: CreateEnfermedadDto): Promise<IApiResponse> {
        const data = await this.pacienteService.createEnfermedad(dto);
        return { statusCode: HttpStatus.CREATED, message: 'Enfermedad creada', data };
    }

    @Put('enfermedad/:id')
    async updateEnfermedad(@Param('id') id: string, @Body() dto: UpdateEnfermedadDto): Promise<IApiResponse> {
        const data = await this.pacienteService.updateEnfermedad(id, dto);
        return { statusCode: HttpStatus.OK, message: 'Enfermedad actualizada', data };
    }

    @Post('paciente-enfermedad')
    async addEnfermedadToPaciente(@Body() dto: CreatePacienteEnfermedadDto): Promise<IApiResponse> {
        const data = await this.pacienteService.addEnfermedadToPaciente(dto);
        return { statusCode: HttpStatus.CREATED, message: 'Enfermedad agregada al paciente', data };
    }

    @Get('paciente/:idPaciente/enfermedades')
    async getEnfermedadesByPaciente(@Param('idPaciente') idPaciente: string): Promise<IApiResponse> {
        const data = await this.pacienteService.getEnfermedadesByPaciente(idPaciente);
        return { statusCode: HttpStatus.OK, message: 'Enfermedades del paciente', data };
    }

    // Sintomas
    

    @Post('sintoma')
    async createSintoma(@Body() dto: CreateSintomaDto): Promise<IApiResponse> {
        const data = await this.pacienteService.createSintoma(dto);
        return { statusCode: HttpStatus.CREATED, message: 'Sintoma creado', data };
    }

    @Put('sintoma/:id')
    async updateSintoma(@Param('id') id: string, @Body() dto: UpdateSintomaDto): Promise<IApiResponse> {
        const data = await this.pacienteService.updateSintoma(id, dto);
        return { statusCode: HttpStatus.OK, message: 'Sintoma actualizado', data };
    }

    @Post('paciente-sintoma')
    async addSintomaToPaciente(@Body() dto: CreatePacienteSintomaDto): Promise<IApiResponse> {
        const data = await this.pacienteService.addSintomaToPaciente(dto);
        return { statusCode: HttpStatus.CREATED, message: 'Sintoma agregado al paciente', data };
    }

    @Get('paciente/:idPaciente/sintomas')
    async getSintomasByPaciente(@Param('idPaciente') idPaciente: string): Promise<IApiResponse> {
        const data = await this.pacienteService.getSintomasByPaciente(idPaciente);
        return { statusCode: HttpStatus.OK, message: 'Sintomas del paciente', data };
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