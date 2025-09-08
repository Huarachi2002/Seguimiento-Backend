import { Tipo_Cita } from "src/modules/tratamiento/entities/tipo_cita.entity";
import { setSeederFactory } from "typeorm-extension";


export const TipoCitaFactory = setSeederFactory(Tipo_Cita, (faker) => {
    const tipo_cita = new Tipo_Cita();
    
    tipo_cita.descripcion = faker.helpers.arrayElement([
        'Consulta Inicial',
        'Seguimiento',
        'Control de Medicación',
        'Consulta de Resultados'
    ]);
    tipo_cita.estado = true;
    return tipo_cita;
});
