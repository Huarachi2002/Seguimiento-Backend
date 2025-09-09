import { Tipo_Parentesco } from "../modules/paciente/entities/tipo_parentesco.entity";
import { setSeederFactory } from "typeorm-extension";


export default setSeederFactory(Tipo_Parentesco, (faker) => {
    const tipo_parentesco = new Tipo_Parentesco();
    
    tipo_parentesco.descripcion = faker.helpers.arrayElement([
        'Padre',
        'Madre',
        'Hermano/a',
        'Hijo/a',
        'Tío/a',
        'Primo/a',
        'Abuelo/a',
        'Cónyuge',
        'Amigo/a',
        'Vecino/a'
    ]);
    tipo_parentesco.estado = true;
    return tipo_parentesco;
});
