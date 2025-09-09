import { Tipo_Tratamiento } from "../modules/tratamiento/entities/tipo_tratamiento.entity";
import { setSeederFactory } from "typeorm-extension";


export default setSeederFactory(Tipo_Tratamiento, (faker) => {
    const tipo_tratamiento = new Tipo_Tratamiento();

    tipo_tratamiento.descripcion = faker.helpers.arrayElement([
        'Consulta',
        'Control',
        'Urgencia',
        'Emergencia',
        'Hospitalización',
        'Rehabilitación'
    ]);
    tipo_tratamiento.estado = true;
    return tipo_tratamiento;
});
