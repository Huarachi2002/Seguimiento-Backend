import { Injectable, Logger, HttpException, HttpStatus } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class IAService {
    private readonly logger = new Logger(IAService.name);
    private readonly url: string;

    constructor(
        private configService: ConfigService,
        private httpService: HttpService
    ) {
        this.url = this.configService.get<string>('IA_SERVICE_URL');
    }

    public async getHistorialConversacionByPaciente(telefono: string): Promise<any> {
        this.logger.log(`Obteniendo historial de conversación para el paciente con telefono: ${telefono}`);
        
        try {
            const fullUrl = `${this.url}/chat/history/${telefono}`;
            this.logger.log(`Recuperando Historial de ${telefono}`);
            this.logger.log(`URL: ${fullUrl}`);
            
            // Usar HttpService (basado en Axios) en lugar de fetch
            const response = await firstValueFrom(
                this.httpService.get(fullUrl, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    timeout: 30000 // 30 segundos de timeout
                })
            );

            this.logger.log(`Respuesta de IA: ${JSON.stringify(response.data)}`);

            return response.data;
        } catch (error) {
            // Mejor manejo de errores con Axios
            if (error.response) {
                // El servidor respondió con un código de estado fuera del rango 2xx
                this.logger.error(`Error de respuesta de IA: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
                throw new HttpException(
                    `Error al comunicarse con IA: ${error.response.statusText}`,
                    error.response.status
                );
            } else if (error.request) {
                // La petición fue hecha pero no hubo respuesta
                this.logger.error(`Error de conexión con IA: No se recibió respuesta. ${error.message}`);
                throw new HttpException(
                    'No se pudo conectar con el servicio de IA. Verifica que esté disponible.',
                    HttpStatus.SERVICE_UNAVAILABLE
                );
            } else {
                // Algo pasó al configurar la petición
                this.logger.error(`Error al enviar a IA: ${error.message}`);
                throw new HttpException(
                    'Error al procesar historial',
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }
    }
}