
import { Zona_Uv } from "../modules/monitoreo/entities/zona_uv.entity";
import { setSeederFactory } from "typeorm-extension";


export default setSeederFactory(Zona_Uv, (faker) => {
    const zona_uv = new Zona_Uv();

    zona_uv.descripcion = `UV ${faker.number.int({min: 1, max: 50})} - ${faker.location.city()}`;
    zona_uv.vertices = JSON.stringify([
        { lat: faker.location.latitude(), lng: faker.location.longitude() },
        { lat: faker.location.latitude(), lng: faker.location.longitude() },
        { lat: faker.location.latitude(), lng: faker.location.longitude() },
        { lat: faker.location.latitude(), lng: faker.location.longitude() }
    ])
    
    return zona_uv;
});
