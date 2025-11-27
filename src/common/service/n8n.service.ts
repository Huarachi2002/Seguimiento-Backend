import { Injectable, Inject, forwardRef, Logger, HttpException, HttpStatus } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { N8NResponse } from "../interface/n8n-reponse.interface";
import { N8NWebhookPayload } from "../interface/n8n-payload.interface";
import { User } from "@/modules/tratamiento/entities/user.entity";
import { Paciente } from "@/modules/paciente/entities/paciente.entity";
import { Enfermedad } from "@/modules/paciente/entities/enfermedad.entity";
import { Contacto_Paciente } from "@/modules/paciente/entities/contacto.entity";

@Injectable()
export class N8NService {
    private readonly logger = new Logger(N8NService.name);
    private readonly n8nWebHookUrl: string;
    private readonly n8nApiKey: string;

    constructor(
        private configService: ConfigService
    ) {
        this.n8nWebHookUrl = this.configService.get<string>('N8N_WEBHOOK_URL');
        this.n8nApiKey = this.configService.get<string>('N8N_API_KEY');
    }

    async enviarNotificacionLaboratorio(
        email: string[],
        nombrePaciente: string,
        tipoLaboratorio: string,
        resultado: string,
    ): Promise<N8NResponse> {
        try {
            const payload: N8NWebhookPayload = {
                tipo: 'notificacion_laboratorio',
                destinatarios: email,
                datos: {
                    nombre: nombrePaciente,
                    tipo_laboratorio: tipoLaboratorio,
                    resultado,
                    mensaje: `Hola ${nombrePaciente}, su resultado de ${tipoLaboratorio} es: ${resultado}. Por favor, consulte con su médico para más detalles.`
                }
            };
            return await this.sendToN8N(payload);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al enviar notificación de laboratorio',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async enviarRecordatorioCita(
        telefonos: string[],
        recordatoriosData: any[] 
        // nombrePaciente: string,
        // fechaCita: Date,
        // tipoCita: string
    ): Promise<N8NResponse> {
        try {
            const payload: N8NWebhookPayload = {
                tipo: 'recordatorio_cita',
                destinatarios: telefonos,
                datos: {
                    recordatoriosData,
                    // nombre: nombrePaciente,
                    // fecha: fechaCita.toISOString(),
                    // tipo: tipoCita,
                    // mensaje: `Hola ${nombrePaciente}, le recordamos que tiene una cita programada para el ${fechaCita} (${tipoCita}). Por favor, no olvide asistir.`
                }
            };

            return await this.sendToN8N(payload);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al enviar recordatorio de cita',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async pacienteRiesgoSalud(
        usuarios: User[],
        paciente: Paciente,
        enfermedad_base: Enfermedad[],
        contactos: Contacto_Paciente[],
    ): Promise<N8NResponse> {
        try {
            const dataContactos = contactos.map((contacto) => {
                return {
                    nombre: contacto.nombre_contacto,
                    telefono: contacto.numero_telefono_contacto,
                    parentesco: contacto.tipo_parentesco.descripcion
                }
            });
            const payload: N8NWebhookPayload = {
                tipo: 'alerta_riesgo_salud',
                destinatarios: usuarios.map(user => user.telefono),
                datos: {
                    paciente,
                    enfermedad_base,
                    contactos: dataContactos,
                }
            };
            return await this.sendToN8N(payload);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al enviar alerta de riesgo de salud',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    private async sendToN8N(payload: N8NWebhookPayload): Promise<N8NResponse> {
        try {
            this.logger.log(`Enviando payload a n8n: ${JSON.stringify(payload)}`);
            this.logger.log(`URL de webhook: ${this.n8nWebHookUrl}/webhook/b727a688-7624-4054-943e-39ab560693cd`);
            const response = await fetch(`${this.n8nWebHookUrl}/webhook/b727a688-7624-4054-943e-39ab560693cd`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new HttpException(
                    {
                        success: false,
                        message: `Error al comunicarse con N8N: ${response.statusText}`,
                        data: null,
                        error: response.statusText,
                    },
                    HttpStatus.BAD_GATEWAY
                );
            }

            const data = await response.json();

            this.logger.log(`Respuesta de n8n: ${JSON.stringify(data)}`);

            return {
                success: true,
                message: 'Payload enviado exitosamente a N8N',
                data
            };
        } catch (error) {
            this.logger.error(`Error al enviar webhook a N8N: ${error.message}`);
            
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                {
                    success: false,
                    message: 'Error al procesar notificación',
                    data: null,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    
}