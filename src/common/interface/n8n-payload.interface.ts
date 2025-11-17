export interface N8NWebhookPayload {
    tipo: 'recordatorio_cita' | 'notificacion_laboratorio' | 'alerta_abandono';
    destinatarios: string[];
    datos: Record<string, any>;
}