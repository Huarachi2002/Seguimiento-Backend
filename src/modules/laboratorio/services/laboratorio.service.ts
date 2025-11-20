import { Injectable, Inject, forwardRef, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Laboratorio } from "../entities/laboratorio.entity";

import { Tipo_Control } from "../entities/tipo_control.entity";
import { Tipo_Laboratorio } from "../entities/tipo_laboratorio.entity";
import { Tipo_Resultado } from "../entities/tipo_resultado.entity";

import { CreateLaboratorioDto } from "../dto/create-laboratorio.dto";
import { User } from "@/modules/tratamiento/entities/user.entity";
import { Paciente } from "@/modules/paciente/entities/paciente.entity";
import { UserService } from "@/modules/tratamiento/services/user.service";
import { N8NService } from "@/common/service/n8n.service";


@Injectable()
export class LaboratorioService {
    private readonly logger = new Logger(N8NService.name);

    constructor(
        @InjectRepository(Laboratorio) private laboratorioRepository: Repository<Laboratorio>,
        @InjectRepository(Tipo_Control) private tipoControlRepository: Repository<Tipo_Control>,
        @InjectRepository(Tipo_Laboratorio) private tipoLaboratorioRepository: Repository<Tipo_Laboratorio>,
        @InjectRepository(Tipo_Resultado) private tipoResultadoRepository: Repository<Tipo_Resultado>,
        
        @Inject(forwardRef(() => UserService)) private userService: UserService,
        @Inject(forwardRef(() => N8NService)) private n8nService: N8NService,
    ) { }

    async getTiposControl(): Promise<Tipo_Control[]> {
        return this.tipoControlRepository.find();
    }

    async getTiposLaboratorio(): Promise<Tipo_Laboratorio[]> {
        return this.tipoLaboratorioRepository.find();
    }

    async getTiposResultadoByTipoLaboratorio(idTipoLaboratorio: string): Promise<Tipo_Resultado[]> {
        return this.tipoResultadoRepository.find({
            where: { tipo_laboratorio: { id: idTipoLaboratorio } },
        });
    }

    async getTipoResultadoById(id: string): Promise<Tipo_Resultado> {
         return this.tipoResultadoRepository.findOneBy({ id });
    }

    async getTipoLaboratorioById(id: string): Promise<Tipo_Laboratorio> {
         return this.tipoLaboratorioRepository.findOneBy({ id });
    }

    async getTipoControlById(id: string): Promise<Tipo_Control> {
         return this.tipoControlRepository.findOneBy({ id });
    }


    async createLaboratorio(
        dto: CreateLaboratorioDto, 
        paciente:Paciente, 
        tipo_control: Tipo_Control, 
        tipo_laboratorio: Tipo_Laboratorio, 
        tipo_resultado: Tipo_Resultado): Promise<Laboratorio> {

        this.logger.log(`Creando laboratorio para el paciente: ${paciente.nombre}, Tipo Laboratorio: ${tipo_laboratorio.descripcion}, Resultado: ${tipo_resultado.descripcion}`);
        const laboratorio = this.laboratorioRepository.create({
            codigo: dto.codigo,
            fecha: dto.fecha,
            observacion: dto.observacion,
            paciente,
            tipo_control,
            tipo_laboratorio,
            tipo_resultado
        });

        const savedLaboratorio = await this.laboratorioRepository.save(laboratorio);
        this.logger.log(`Laboratorio creado: ${JSON.stringify(savedLaboratorio)}`);
        
        this.userService.getUsersByNotificationEmail()
            .then(async (usersToNotifyEmail) => {
                this.logger.log(`(Async) Usuarios a notificar: ${usersToNotifyEmail.length}`);
                
                if (usersToNotifyEmail.length > 0) {
                    const emails = usersToNotifyEmail.map(u => u.email);
                    // Llamamos a N8N y retornamos la promesa para encadenar el catch
                    return this.n8nService.enviarNotificacionLaboratorio(
                        emails,
                        paciente.nombre,
                        tipo_laboratorio.descripcion,
                        tipo_resultado.descripcion
                    );
                }
            })
            .then(() => {
                this.logger.log('(Async) Notificación a N8N enviada exitosamente');
            })
            .catch((error) => {
                // Si falla N8N, solo lo logueamos, pero NO afecta al usuario final ni a la creación del laboratorio
                this.logger.error(`(Async) Error al enviar notificación a N8N: ${error.message}`, error.stack);
            });

        return savedLaboratorio;
    }

    async getLaboratoriosByPaciente(idPaciente: string): Promise<Laboratorio[]> {
        return this.laboratorioRepository.find({
            where: {paciente: {id: idPaciente }},
            relations:{
                paciente: true,
                tipo_control: true,
                tipo_laboratorio: true,
                tipo_resultado: true
            }
        });
    }

    async getLaboratorios(): Promise<Laboratorio[]> {
        return this.laboratorioRepository.find({
            relations:{
                paciente: true,
                tipo_control: true,
                tipo_laboratorio: true,
                tipo_resultado: true
            }
        });
    }
}