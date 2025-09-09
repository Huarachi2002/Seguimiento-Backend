import { Estado_Tratamiento } from "../modules/tratamiento/entities/estado_tratamiento.entity";
import { setSeederFactory } from "typeorm-extension";


export default setSeederFactory(Estado_Tratamiento, (faker) => {
    const estado_tratamiento = new Estado_Tratamiento();
    
    estado_tratamiento.descripcion = faker.helpers.arrayElement([
        'Pendiente',
        'En Proceso',
        'Completado',
        'Cancelado'
    ]);
    estado_tratamiento.estado = true;
    return estado_tratamiento;
});
