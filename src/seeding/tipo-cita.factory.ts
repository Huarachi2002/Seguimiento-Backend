import { Tipo_Cita } from "../modules/tratamiento/entities/tipo_cita.entity";
import { setSeederFactory } from "typeorm-extension";


export default setSeederFactory(Tipo_Cita, (faker) => {
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
