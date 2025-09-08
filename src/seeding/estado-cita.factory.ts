import { Estado_Cita } from "src/modules/tratamiento/entities/estado_cita.entity";
import { setSeederFactory } from "typeorm-extension";


export const EstadoCitaFactory = setSeederFactory(Estado_Cita, (faker) => {
    const estado_cita = new Estado_Cita();

    estado_cita.descripcion = faker.helpers.arrayElement([
        'Programada',
        'Completada',
        'Cancelada',
        'Reprogramada',
        'No Asistida'
    ]);
    estado_cita.estado = true;
    return estado_cita;
});
