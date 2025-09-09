import { Zona_Mza } from "../modules/monitoreo/entities/zona_mza.entity";
import { Zona_Uv } from "../modules/monitoreo/entities/zona_uv.entity";
import { Tipo_Parentesco } from "../modules/paciente/entities/tipo_parentesco.entity";
import { Estado_Cita } from "../modules/tratamiento/entities/estado_cita.entity";
import { Estado_Tratamiento } from "../modules/tratamiento/entities/estado_tratamiento.entity";
import { Rol } from "../modules/tratamiento/entities/rol.entity";
import { Tipo_Cita } from "../modules/tratamiento/entities/tipo_cita.entity";
import { Tipo_Tratamiento } from "../modules/tratamiento/entities/tipo_tratamiento.entity";
import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";


export default class MainSeeder implements Seeder {
    public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
        
        console.log("Iniciando el proceso de seeding...");
        // 1. Seeder para Tipo_Parentesco (datos fijos)
        await this.seedTipoParentesco(dataSource);

        // 2. Seeder para Zona_Uv
        await this.seedZonaUv(dataSource, factoryManager);

        // 3. Seeder para Zona_Mza
        await this.seedZonaMza(dataSource, factoryManager);

        // 4. Seeder para Tipo_Tratamiento (datos fijos)
        await this.seedTipoTratamiento(dataSource);

        // 5. Seeder para Tipo_Cita (datos fijos)
        await this.seedTipoCita(dataSource);

        // 6. Seeder para Estado_Cita (datos fijos)
        await this.seedEstadoCita(dataSource);

        // 7. Seeder para Estado_Tratamiento (datos fijos)
        await this.seedEstadoTratamiento(dataSource);

        // 8. Seeder para Rol (datos fijos)
        await this.seedRol(dataSource);

        console.log("Proceso de seeding completado.");
    }

    private async seedRol(dataSource: DataSource): Promise<void> {
        const repository = dataSource.getRepository(Rol);
        
        const count = await repository.count();
        if (count > 0) {
            console.log("Rol ya tiene datos, se omite el seeding.");
            return;
        }

        const roles = [
            'Admin',
            'Doctor',
            'Licenciado'
        ];
        for (const descripcion of roles) {
            const rol = repository.create({ descripcion });
            await repository.save(rol);
        }
        console.log("Seeding de Rol completado.");
    }

    private async seedEstadoTratamiento(dataSource: DataSource): Promise<void> {
        const repository = dataSource.getRepository(Estado_Tratamiento);

        const count = await repository.count();
        if (count > 0) {
            console.log("Estado_Tratamiento ya tiene datos, se omite el seeding.");
            return;
        }

        const estadosTratamiento = [
            'Pendiente',
            'En Proceso',
            'Completado',
            'Cancelado'
        ];
        for (const descripcion of estadosTratamiento) {
            const estadoTratamiento = repository.create({
                descripcion,
                estado: true
            });
            await repository.save(estadoTratamiento);
        }

        console.log("Seeding de Estado_Tratamiento completado.");
    }

    private async seedEstadoCita(dataSource: DataSource): Promise<void> {
        const repository = dataSource.getRepository(Estado_Cita);

        const count = await repository.count();
        if (count > 0) {
            console.log("Estado_Cita ya tiene datos, se omite el seeding.");
            return;
        }

        const estadosCita = [
            'Programada',
            'Completada',
            'Cancelada',
            'Reprogramada',
            'No Asistida'
        ];

        for (const descripcion of estadosCita) {
            const estadoCita = repository.create({
                descripcion,
                estado: true
            });
            await repository.save(estadoCita);
        }

        console.log("Seeding de Estado_Cita completado.");
    }

    private async seedTipoCita(dataSource: DataSource): Promise<void> {
        const repository = dataSource.getRepository(Tipo_Cita);

        const count = await repository.count();
        if (count > 0) {
            console.log("Tipo_Cita ya tiene datos, se omite el seeding.");
            return;
        }

        const tiposCita = [
            'Consulta Inicial',
            'Seguimiento',
            'Control de Medicación',
            'Consulta de Resultados'
        ];

        for (const descripcion of tiposCita) {
            const tipoCita = repository.create({
                descripcion,
                estado: true
            });
            await repository.save(tipoCita);
        }

        console.log("Seeding de Tipo_Cita completado.");
    }

    private async seedTipoTratamiento(dataSource: DataSource): Promise<void> {
        const repository = dataSource.getRepository(Tipo_Tratamiento);

        const count = await repository.count();
        if (count > 0) {
            console.log("Tipo_Tratamiento ya tiene datos, se omite el seeding.");
            return;
        }

        const tiposTratamiento = [
            'Consulta',
            'Control',
            'Urgencia',
            'Emergencia',
            'Hospitalización',
            'Rehabilitación'
        ];

        for (const descripcion of tiposTratamiento) {
            const tipoTratamiento = repository.create({ 
                descripcion,
                estado: true
            });
            await repository.save(tipoTratamiento);
        }
        console.log("Seeding de Tipo_Tratamiento completado.");
    }

    private async seedTipoParentesco(dataSource: DataSource): Promise<void> {
        const repository = dataSource.getRepository(Tipo_Parentesco);

        const count = await repository.count();
        if (count > 0) {
            console.log("Tipo_Parentesco ya tiene datos, se omite el seeding.");
            return;
        }

        const tiposParentesco = [
            'Padre',
            'Madre',
            'Hermano/a',
            'Hijo/a',
            'Abuelo/a',
            'Abuela',
            'Tío/a',
            'Primo/a',
            'Cónyuge',
            'Esposo/a',
            'Amigo/a',
            'Vecino/a',
            'Otro'
        ];

        for (const descripcion of tiposParentesco) {
            const tipoParentesco = repository.create({ 
                descripcion,
                estado: true
            });

            await repository.save(tipoParentesco);
        }

        console.log("Seeding de Tipo_Parentesco completado.");
    }

    private async seedZonaUv(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
        const repository = dataSource.getRepository(Zona_Uv);

        const count = await repository.count();
        if (count > 0) {
            console.log("Zona_Uv ya tiene datos, se omite el seeding.");
            return;
        }

        const zonaUvFactory = factoryManager.get(Zona_Uv);
        await zonaUvFactory.saveMany(10); // Crear 10 registros de ejemplo

        console.log("Seeding de Zona_Uv completado.");
    }

    private async seedZonaMza(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
        const zonaMzaRepository = dataSource.getRepository(Zona_Mza);
        const zonaUvRepository = dataSource.getRepository(Zona_Uv);

        const count = await zonaMzaRepository.count();
        if (count > 0) {
            console.log("Zona_Mza ya tiene datos, se omite el seeding.");
            return;
        }

        const zonaUvs = await zonaUvRepository.find();

        if (zonaUvs.length === 0) {
            console.log("No hay datos en Zona_Uv. Por favor, ejecute el seeding de Zona_Uv primero.");
            return;
        }

        const zonaMzaFactory = factoryManager.get(Zona_Mza);

        for (const zonaUv of zonaUvs) {
            const numManzanas = Math.floor(Math.random() * 5) + 3; // Entre 3 y 7 manzanas por UV

            for (let i = 0; i < numManzanas; i++) {
                const zonaMza = await zonaMzaFactory.make();
                zonaMza.zona_uv = zonaUv;
                await zonaMzaRepository.save(zonaMza);
            }
        }
        
        const totalManzanas = await zonaMzaRepository.count();
        console.log(`Seeding de Zona_Mza completado. Total de manzanas creadas: ${totalManzanas}`);
    }
    
}