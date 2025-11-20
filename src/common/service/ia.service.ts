import { Injectable, Inject, forwardRef, Logger, HttpException, HttpStatus } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { N8NResponse } from "../interface/n8n-reponse.interface";
import { N8NWebhookPayload } from "../interface/n8n-payload.interface";

@Injectable()
export class IAService {
    private readonly logger = new Logger(IAService.name);
    private readonly url: string;

    constructor(
        private configService: ConfigService
    ) {
        this.url = this.configService.get<string>('N8N_WEBHOOK_URL');
    }

    async enviarNotificacionLaboratorio(
        email: string[],
        nombrePaciente: string,
        tipoLaboratorio: string,
        resultado: string,
    ): Promise<N8NResponse> {
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
        return this.sendToN8N(payload);
    }

    async enviarRecordatorioCita(
        telefonos: string[],
        mensajes: string[],
        // nombrePaciente: string,
        // fechaCita: Date,
        // tipoCita: string
    ): Promise<N8NResponse> {
        const payload: N8NWebhookPayload = {
            tipo: 'recordatorio_cita',
            destinatarios: telefonos,
            datos: {
                mensajes,
                // nombre: nombrePaciente,
                // fecha: fechaCita.toISOString(),
                // tipo: tipoCita,
                // mensaje: `Hola ${nombrePaciente}, le recordamos que tiene una cita programada para el ${fechaCita} (${tipoCita}). Por favor, no olvide asistir.`
            }
        };

        return this.sendToN8N(payload);
    }

    private async sendToN8N(payload: N8NWebhookPayload): Promise<N8NResponse> {
        try {
            this.logger.log(`Enviando payload a n8n: ${JSON.stringify(payload)}`);

            const response = await fetch(`${this.n8nWebHookUrl}/webhook/b727a688-7624-4054-943e-39ab560693cd`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new HttpException(
                    `Error al comunicarse con N8N: ${response.statusText}`,
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
            
            throw new HttpException(
                'Error al procesar notificación',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    private async getHistorialConversacionByPaciente(telefono: string): Promise<any[]> {
        // Lógica para obtener el historial de conversación del paciente desde la base de datos
        this.logger.log(`Obteniendo historial de conversación para el paciente con telefono: ${telefono}`);
        // Aquí deberías implementar la lógica real para obtener los datos
        try {
            this.logger.log(`Recuperando Historial de ${telefono}`);

            const response = await fetch(`${this.url}/history/${telefono}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new HttpException(
                    `Error al comunicarse con IA: ${response.statusText}`,
                    HttpStatus.BAD_GATEWAY
                );
            }

            const data = await response.json();

            this.logger.log(`Respuesta de IA: ${JSON.stringify(data)}`);

            return {
                success: true,
                message: 'Historial obtenido exitosamente de IA',
                data
            };
        } catch (error) {
            this.logger.error(`Error al enviar a IA: ${error.message}`);
            
            throw new HttpException(
                'Error al procesar historial',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
    
}