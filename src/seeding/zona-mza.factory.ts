
import { Zona_Mza } from "src/modules/monitoreo/entities/zona_mza.entity";
import { setSeederFactory } from "typeorm-extension";


export const ZonaMzaFactory = setSeederFactory(Zona_Mza, (faker) => {
    const zona_mza = new Zona_Mza();

    zona_mza.descripcion = `Mza ${faker.string.alphanumeric(3).toUpperCase()} - ${faker.location.streetAddress()}`;
    zona_mza.vertices = JSON.stringify([
        { lat: faker.location.latitude(), lng: faker.location.longitude() },
        { lat: faker.location.latitude(), lng: faker.location.longitude() },
        { lat: faker.location.latitude(), lng: faker.location.longitude() },
        { lat: faker.location.latitude(), lng: faker.location.longitude() }
    ]);

    return zona_mza;
});
