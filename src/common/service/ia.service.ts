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
        this.url = this.configService.get<string>('IA_SERVICE_URL');
    }

    public async getHistorialConversacionByPaciente(telefono: string): Promise<any> {
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

            return data;
        } catch (error) {
            this.logger.error(`Error al enviar a IA: ${error.message}`);
            
            throw new HttpException(
                'Error al procesar historial',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
    
}