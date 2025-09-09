
import { Rol } from "../modules/tratamiento/entities/rol.entity";
import { setSeederFactory } from "typeorm-extension";


export default setSeederFactory(Rol, (faker) => {
    const rol = new Rol();

    rol.descripcion = faker.helpers.arrayElement([
        'Admin',
        'Doctor',
        'Licenciado'
    ]);
    
    return rol;
});
