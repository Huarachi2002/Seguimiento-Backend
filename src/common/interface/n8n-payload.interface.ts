export interface N8NWebhookPayload {
    tipo: 'recordatorio_cita' | 'notificacion_laboratorio' | 'alerta_abandono' | 'alerta_riesgo_salud';
    destinatarios: string[];
    datos: Record<string, any>;
}