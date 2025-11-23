import { Fase_Tratamiento } from '../modules/tratamiento/entities/fase_tratamiento.entity';
import { Zona_Mza } from '../modules/monitoreo/entities/zona_mza.entity';
import { Zona_Uv } from '../modules/monitoreo/entities/zona_uv.entity';
import { Tipo_Parentesco } from '../modules/paciente/entities/tipo_parentesco.entity';
import { Estado_Cita } from '../modules/tratamiento/entities/estado_cita.entity';
import { Estado_Tratamiento } from '../modules/tratamiento/entities/estado_tratamiento.entity';
import { Rol } from '../modules/tratamiento/entities/rol.entity';
import { Tipo_Cita } from '../modules/tratamiento/entities/tipo_cita.entity';
import { Tipo_Tratamiento } from '../modules/tratamiento/entities/tipo_tratamiento.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Motivo } from '../modules/tratamiento/entities/motivo.entity';
import { Tipo_Laboratorio } from '../modules/laboratorio/entities/tipo_laboratorio.entity';
import { Tipo_Control } from '../modules/laboratorio/entities/tipo_control.entity';
import { Tipo_Resultado } from '../modules/laboratorio/entities/tipo_resultado.entity';
import { Enfermedad } from '../modules/paciente/entities/enfermedad.entity';
import { Sintoma } from '../modules/paciente/entities/sintoma.entity';
import { Localizacion_TB } from '../modules/tratamiento/entities/localizacion_tb.entity';
import { User } from '../modules/tratamiento/entities/user.entity';

export default class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    console.log('Iniciando el proceso de seeding...');
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

    // 9. Seeder para Fase_Tratamiento (datos fijos)
    await this.seedFaseTratamiento(dataSource);

    // 10. Seeder para User (datos fijos)
    await this.seedUser(dataSource);

    // 11. Seeder para Motivos (datos fijos)
    await this.seedMotivo(dataSource);

    // 12. Seeder para Enfermedades (catalogo)
    await this.seedEnfermedad(dataSource);

    // 13. Seeder para Sintomas (catalogo)
    await this.seedSintoma(dataSource);

    // 14. Seeder para Localizaciones TB (catalogo)
    await this.seedLocalizacionTB(dataSource);

    // 12. Seeder para Tipo Laboratorio (datos fijos)
    await this.seedTipoLaboratorio(dataSource);

    // 13. Seeder para Tipo Control (datos fijos)
    await this.seedTipoControl(dataSource);

    // 13. Seeder para Tipo Control (datos fijos)
    await this.seedTipoResultado(dataSource);

    console.log('Proceso de seeding completado.');
  }

  private async seedLocalizacionTB(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(Localizacion_TB);

    const count = await repository.count();
    if (count > 0) {
      console.log('Localizacion_TB ya tiene datos, se omite el seeding.');
      return;
    }

    const localizaciones = [
      'Pulmonar',
      'Meninges',
      'Huesos',
      'Articulaciones',
      'Ganglios linfáticos',
      'Otro',
    ];

    for (const descripcion of localizaciones) {
      const entity = repository.create({ descripcion, estado: true });
      await repository.save(entity);
    }

    console.log('Seeding de Localizacion_TB completado.');
  }

  private async seedTipoLaboratorio(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(Tipo_Laboratorio);

    const count = await repository.count();
    if (count > 0) {
      console.log('Tipo Laboratorio ya tiene datos, se omite el seeding.');
      return;
    }

    const tiposLaboratorios = ['Basiloscopia', 'Cultivo'];

    for (const descripcion of tiposLaboratorios) {
      const motivo = repository.create({
        descripcion,
      });
      await repository.save(motivo);
    }

    console.log('Seeding de Motivo completado.');
  }

  private async seedTipoResultado(dataSource: DataSource): Promise<void> {
    const tipoResultadoRepository = dataSource.getRepository(Tipo_Resultado);
    const tipoLaboratorioRepository =
      dataSource.getRepository(Tipo_Laboratorio);

    const count = await tipoResultadoRepository.count();
    if (count > 0) {
      console.log('Tipo_Resultado ya tiene datos, se omite el seeding.');
      return;
    }
    const tiposLaboratorio = await tipoLaboratorioRepository.find();

    const resultadosPorLaboratorio: Record<string, string[]> = {
      Basiloscopia: [
        'Negativo',
        'Positivo 1 - 9 BAAR en 100 campos',
        '(+) 10 - 99 BAAR en 100 campos',
        '(++) 1 - 10 BAAR en 50 campos',
        '(+++) > 10 BAAR en 20 campos',
      ],
      Cultivo: [
        'Negativo',
        'Contaminado',
        'Positivo 1 - 19 colonias',
        '(+) 20 - 100 colonias',
        '(++) > 100 colonias separadas',
        '(+++) incontable confluente',
      ],
    };

    for (const tipoLab of tiposLaboratorio) {
      const resultados = resultadosPorLaboratorio[tipoLab.descripcion] || [
        'No definido',
      ];
      for (const descripcion of resultados) {
        const tipoResultado = tipoResultadoRepository.create({
          descripcion,
          tipo_laboratorio: tipoLab,
        });
        await tipoResultadoRepository.save(tipoResultado);
      }
    }

    console.log('Seeding de Tipo_Resultado completado.');
  }

  private async seedTipoControl(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(Tipo_Control);

    const count = await repository.count();
    if (count > 0) {
      console.log('Tipo Control ya tiene datos, se omite el seeding.');
      return;
    }

    const tiposControl = [
      'Test diagnóstico',
      'Control de seguimiento',
      'Término de Tratamiento',
      'Control post-tratamiento',
    ];

    for (const descripcion of tiposControl) {
      const motivo = repository.create({
        descripcion,
      });
      await repository.save(motivo);
    }

    console.log('Seeding de Motivo completado.');
  }

  private async seedEnfermedad(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(Enfermedad);
    const count = await repository.count();
    if (count > 0) {
      console.log('Enfermedad ya tiene datos, se omite el seeding.');
      return;
    }

    const enfermedades = [
      'Diabetes',
      'Hipertensión arterial',
      'Asma',
      'EPOC',
      'Enfermedad renal crónica',
      'VIH',
      'Tuberculosis previa',
      'Cardiopatía',
      'Hepatitis',
      'Otra',
    ];

    for (const descripcion of enfermedades) {
      const entity = repository.create({ descripcion, estado: true });
      await repository.save(entity);
    }

    console.log('Seeding de Enfermedad completado.');
  }

  private async seedSintoma(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(Sintoma);
    const count = await repository.count();
    if (count > 0) {
      console.log('Sintoma ya tiene datos, se omite el seeding.');
      return;
    }

    const sintomas = [
      'Fiebre',
      'Tos',
      'Pérdida de peso',
      'Sudoración nocturna',
      'Fatiga',
      'Dolor torácico',
      'Dificultad respiratoria',
      'Náuseas',
      'Vómitos',
      'Diarrea',
    ];

    for (const descripcion of sintomas) {
      const entity = repository.create({ descripcion, estado: true });
      await repository.save(entity);
    }

    console.log('Seeding de Sintoma completado.');
  }

  private async seedMotivo(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(Motivo);

    const count = await repository.count();
    if (count > 0) {
      console.log('Motivo ya tiene datos, se omite el seeding.');
      return;
    }

    const motivos = [
      'No tiene tiempo',
      'No le dieron tiempo en el trabajo',
      'Estaba fuera de la ciudad',
      'Otro',
    ];

    for (const descripcion of motivos) {
      const motivo = repository.create({
        descripcion,
        estado: true,
      });
      await repository.save(motivo);
    }

    console.log('Seeding de Motivo completado.');
  }

  private async seedUser(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(User);

    const count = await repository.count();
    if (count > 0) {
      console.log('User ya tiene datos, se omite el seeding.');
      return;
    }

    const users: User[] = [
      { username: 'admin', nombre: 'Admin', contrasena: '123', telefono: '76023033', email: 'roberthuarachi27@gmail.com', estado: true, rol: { descripcion: 'Admin' }, notificar_whatsapp: true, notificar_email: true } as User,
      { username: 'doctor', nombre: 'Doctor', contrasena: '123', telefono: '76023033', email: 'roberthuarachi27@gmail.com', estado: true, rol: { descripcion: 'Doctor' }, notificar_whatsapp: true, notificar_email: true } as User,
      { username: 'licenciado', nombre: 'Licenciado', contrasena: '123', telefono: '76351308', email: 'superenano1514@gmail.com', estado: true, rol: { descripcion: 'Licenciado' }, notificar_whatsapp: true, notificar_email: true } as User,
    ];

    for (const userData of users) {
      const user = repository.create({
        username: userData.username,
        contrasena: userData.contrasena,
        nombre: userData.nombre,
        fecha_login: new Date(),
        rol: { descripcion: userData.rol.descripcion },
        telefono: userData.telefono,
        email: userData.email,
        estado: userData.estado,
        notificar_whatsapp: userData.notificar_whatsapp,
        notificar_email: userData.notificar_email,
      });
      await repository.save(user);
    }

    console.log('Seeding de User completado.');
  }

  private async seedFaseTratamiento(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(Fase_Tratamiento);

    const count = await repository.count();
    if (count > 0) {
      console.log('Fase_Tratamiento ya tiene datos, se omite el seeding.');
      return;
    }
    const fasesTratamiento = [
      'Intensivo',
      'Continuación',
      'Completado',
      'Comenzado',
    ];
    for (const descripcion of fasesTratamiento) {
      const faseTratamiento = repository.create({
        descripcion,
        estado: true,
      });
      await repository.save(faseTratamiento);
    }
    console.log('Seeding de Fase_Tratamiento completado.');
  }

  private async seedRol(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(Rol);

    const count = await repository.count();
    if (count > 0) {
      console.log('Rol ya tiene datos, se omite el seeding.');
      return;
    }

    const roles = ['Admin', 'Doctor', 'Licenciado'];
    for (const descripcion of roles) {
      const rol = repository.create({ descripcion });
      await repository.save(rol);
    }
    console.log('Seeding de Rol completado.');
  }

  private async seedEstadoTratamiento(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(Estado_Tratamiento);

    const count = await repository.count();
    if (count > 0) {
      console.log('Estado_Tratamiento ya tiene datos, se omite el seeding.');
      return;
    }

    const estadosTratamiento = [
      'Curado',
      'Tratamiento Completo',
      'Fracaso',
      'Fallecido',
      'Abandonada',
      'Transferida',
      'En Curso',
    ];
    for (const descripcion of estadosTratamiento) {
      const estadoTratamiento = repository.create({
        descripcion,
        estado: true,
      });
      await repository.save(estadoTratamiento);
    }

    console.log('Seeding de Estado_Tratamiento completado.');
  }

  private async seedEstadoCita(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(Estado_Cita);

    const count = await repository.count();
    if (count > 0) {
      console.log('Estado_Cita ya tiene datos, se omite el seeding.');
      return;
    }

    const estadosCita = [
      'Programado',
      'Confirmado',
      'Asistido',
      'Perdido'
    ];

    for (const descripcion of estadosCita) {
      const estadoCita = repository.create({
        descripcion,
        estado: true,
      });
      await repository.save(estadoCita);
    }

    console.log('Seeding de Estado_Cita completado.');
  }

  private async seedTipoCita(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(Tipo_Cita);

    const count = await repository.count();
    if (count > 0) {
      console.log('Tipo_Cita ya tiene datos, se omite el seeding.');
      return;
    }

    const tiposCita = [
      'Toma de medicamentos',
      'Revisión médica',
      'Visita a domicilio',
    ];

    for (const descripcion of tiposCita) {
      const tipoCita = repository.create({
        descripcion,
        estado: true,
      });
      await repository.save(tipoCita);
    }

    console.log('Seeding de Tipo_Cita completado.');
  }

  private async seedTipoTratamiento(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(Tipo_Tratamiento);

    const count = await repository.count();
    if (count > 0) {
      console.log('Tipo_Tratamiento ya tiene datos, se omite el seeding.');
      return;
    }

    const tiposTratamiento = [
      'Nuevo caso',
      'Recaída',
      'Retratamiento',
      'TB multirresistente',
    ];

    for (const descripcion of tiposTratamiento) {
      const tipoTratamiento = repository.create({
        descripcion,
        estado: true,
      });
      await repository.save(tipoTratamiento);
    }
    console.log('Seeding de Tipo_Tratamiento completado.');
  }

  private async seedTipoParentesco(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(Tipo_Parentesco);

    const count = await repository.count();
    if (count > 0) {
      console.log('Tipo_Parentesco ya tiene datos, se omite el seeding.');
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
      'Otro',
    ];

    for (const descripcion of tiposParentesco) {
      const tipoParentesco = repository.create({
        descripcion,
        estado: true,
      });

      await repository.save(tipoParentesco);
    }

    console.log('Seeding de Tipo_Parentesco completado.');
  }

  private async seedZonaUv(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const repository = dataSource.getRepository(Zona_Uv);

    const count = await repository.count();
    if (count > 0) {
      console.log('Zona_Uv ya tiene datos, se omite el seeding.');
      return;
    }

    const zonaUvFactory = factoryManager.get(Zona_Uv);
    await zonaUvFactory.saveMany(10); // Crear 10 registros de ejemplo

    console.log('Seeding de Zona_Uv completado.');
  }

  private async seedZonaMza(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const zonaMzaRepository = dataSource.getRepository(Zona_Mza);
    const zonaUvRepository = dataSource.getRepository(Zona_Uv);

    const count = await zonaMzaRepository.count();
    if (count > 0) {
      console.log('Zona_Mza ya tiene datos, se omite el seeding.');
      return;
    }

    const zonaUvs = await zonaUvRepository.find();

    if (zonaUvs.length === 0) {
      console.log(
        'No hay datos en Zona_Uv. Por favor, ejecute el seeding de Zona_Uv primero.',
      );
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
    console.log(
      `Seeding de Zona_Mza completado. Total de manzanas creadas: ${totalManzanas}`,
    );
  }
}
