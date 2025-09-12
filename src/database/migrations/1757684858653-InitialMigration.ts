import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1757684858653 implements MigrationInterface {
    name = 'InitialMigration1757684858653'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "rol" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "descripcion" character varying(100) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_7882f3a4a4867f1fe1f44f9741d" UNIQUE ("descripcion"), CONSTRAINT "PK_c93a22388638fac311781c7f2dd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tipo_tratamiento" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "descripcion" character varying(100) NOT NULL, "estado" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_484697ca90b337283457d8186c7" UNIQUE ("descripcion"), CONSTRAINT "PK_389da3b9430e9f1a72d6df985c0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "estado_tratamiento" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "descripcion" character varying(100) NOT NULL, "estado" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_0f3c26848bef7d4ac229eea259d" UNIQUE ("descripcion"), CONSTRAINT "PK_685089819d10d43584df5f86f3d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tipo_parentesco" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "descripcion" character varying(100) NOT NULL, "estado" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_188c60ae9b8622c07d99e51b775" UNIQUE ("descripcion"), CONSTRAINT "PK_51764e7cf46f329107eb56a4396" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contacto_paciente" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nombre_contacto" character varying(100) NOT NULL, "numero_telefono_contacto" character varying(20) NOT NULL, "direccion" character varying NOT NULL, "emergencia" boolean NOT NULL, "tiene_whatsapp" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "pacienteId" uuid, "tipoParentescoId" uuid, CONSTRAINT "UQ_1683492f06f865fe7b62ff3fa84" UNIQUE ("numero_telefono_contacto"), CONSTRAINT "PK_2051b510fdc1558b3631aa8cbf4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "paciente" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "telefono" integer NOT NULL, "nombre" character varying(100) NOT NULL, "numero_doc" character varying(20) NOT NULL, "tipo_doc" integer NOT NULL, "fecha_nacimiento" TIMESTAMP NOT NULL, "genero" integer NOT NULL, "email" character varying(100) NOT NULL, "tiene_whatsapp" boolean NOT NULL, "estado" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_6e7fc0df739d1465a05835c9f81" UNIQUE ("telefono"), CONSTRAINT "UQ_ada5db9852e0ce95dd5600c87bd" UNIQUE ("numero_doc"), CONSTRAINT "PK_cbcb7985432e4b49d32c5243867" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "fase_tratamiento" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "descripcion" character varying(100) NOT NULL, "estado" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_6570b2d8bdccee9bcc32d3428dc" UNIQUE ("descripcion"), CONSTRAINT "PK_3a1e78b83f6a6b7bcc17bb496d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tratamiento_tb" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "codigo_tratamiento" character varying(100) NOT NULL, "fecha_inicio" TIMESTAMP NOT NULL, "fecha_fin" TIMESTAMP NOT NULL, "regimen_medicacion" character varying(100) NOT NULL, "dosis_total" integer NOT NULL, "dosis_completa" integer NOT NULL, "observaciones" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "pacienteId" uuid, "tipoTratamientoId" uuid, "estadoId" uuid, "faseId" uuid, CONSTRAINT "PK_04e30099265d53105a5176cd45d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tipo_cita" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "descripcion" character varying(100) NOT NULL, "estado" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_5a7cd6d2a27d3920119fc33a3d5" UNIQUE ("descripcion"), CONSTRAINT "PK_721d58d442a0e958544cbe3b10e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "estado_cita" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "descripcion" character varying(100) NOT NULL, "estado" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ee3f85c8ffc6398a1551ff447fb" UNIQUE ("descripcion"), CONSTRAINT "PK_8b74dadaed66da54619c7c9fd73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cita" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fecha_programada" TIMESTAMP NOT NULL, "fecha_actual" TIMESTAMP NOT NULL, "observaciones" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "tratamientoId" uuid, "estadoId" uuid, "tipoId" uuid, CONSTRAINT "PK_57e1373661f0c185987b03dc6c8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "constrasena" character varying NOT NULL, "nombre" character varying NOT NULL, "fecha_login" TIMESTAMP NOT NULL, "estado" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "rolId" uuid, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "zona_uv" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "descripcion" character varying(100) NOT NULL, "vertices" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6e587cc4942858f2e2c1d3a3406" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "zona_mza" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "descripcion" character varying(100) NOT NULL, "vertices" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "zonaUvId" uuid, CONSTRAINT "PK_418bb5b8e72e7fcdff208a326f3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "direccion" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "descripcion" character varying(100) NOT NULL, "nro_casa" integer NOT NULL, "latitud" integer NOT NULL, "longitud" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "zonaId" uuid, "pacienteId" uuid, CONSTRAINT "REL_605ffaf59051653aaad1785a75" UNIQUE ("pacienteId"), CONSTRAINT "PK_fd40f79091ad0e37bac52fe5c5b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "contacto_paciente" ADD CONSTRAINT "FK_6cb021c741413e1796b66d60abc" FOREIGN KEY ("pacienteId") REFERENCES "paciente"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contacto_paciente" ADD CONSTRAINT "FK_0afe3fcdcb264d9a49b77ea55b7" FOREIGN KEY ("tipoParentescoId") REFERENCES "tipo_parentesco"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tratamiento_tb" ADD CONSTRAINT "FK_b058545abe9fb1260660444a07d" FOREIGN KEY ("pacienteId") REFERENCES "paciente"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tratamiento_tb" ADD CONSTRAINT "FK_f42b457cb992576c2dfc249869b" FOREIGN KEY ("tipoTratamientoId") REFERENCES "tipo_tratamiento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tratamiento_tb" ADD CONSTRAINT "FK_5b00c84471e7657d0922f3ba62e" FOREIGN KEY ("estadoId") REFERENCES "estado_tratamiento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tratamiento_tb" ADD CONSTRAINT "FK_df60cd8ef1b7a045401069c4e50" FOREIGN KEY ("faseId") REFERENCES "fase_tratamiento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cita" ADD CONSTRAINT "FK_64fd69c6db878d923c6ad2a8e9c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cita" ADD CONSTRAINT "FK_6dc6fb4ad00a7b908d5e0d9ca6c" FOREIGN KEY ("tratamientoId") REFERENCES "tratamiento_tb"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cita" ADD CONSTRAINT "FK_a962b399e5a86adcda9fe91fcf1" FOREIGN KEY ("estadoId") REFERENCES "estado_cita"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cita" ADD CONSTRAINT "FK_d71c19fa915f27a10614c1d8151" FOREIGN KEY ("tipoId") REFERENCES "tipo_cita"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_f66058a8f024b32ce70e0d6a929" FOREIGN KEY ("rolId") REFERENCES "rol"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "zona_mza" ADD CONSTRAINT "FK_2cc816fc224a6bc7f6357c3e3f5" FOREIGN KEY ("zonaUvId") REFERENCES "zona_uv"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "direccion" ADD CONSTRAINT "FK_3f118035cfc71ef413df7478909" FOREIGN KEY ("zonaId") REFERENCES "zona_mza"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "direccion" ADD CONSTRAINT "FK_605ffaf59051653aaad1785a758" FOREIGN KEY ("pacienteId") REFERENCES "paciente"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "direccion" DROP CONSTRAINT "FK_605ffaf59051653aaad1785a758"`);
        await queryRunner.query(`ALTER TABLE "direccion" DROP CONSTRAINT "FK_3f118035cfc71ef413df7478909"`);
        await queryRunner.query(`ALTER TABLE "zona_mza" DROP CONSTRAINT "FK_2cc816fc224a6bc7f6357c3e3f5"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_f66058a8f024b32ce70e0d6a929"`);
        await queryRunner.query(`ALTER TABLE "cita" DROP CONSTRAINT "FK_d71c19fa915f27a10614c1d8151"`);
        await queryRunner.query(`ALTER TABLE "cita" DROP CONSTRAINT "FK_a962b399e5a86adcda9fe91fcf1"`);
        await queryRunner.query(`ALTER TABLE "cita" DROP CONSTRAINT "FK_6dc6fb4ad00a7b908d5e0d9ca6c"`);
        await queryRunner.query(`ALTER TABLE "cita" DROP CONSTRAINT "FK_64fd69c6db878d923c6ad2a8e9c"`);
        await queryRunner.query(`ALTER TABLE "tratamiento_tb" DROP CONSTRAINT "FK_df60cd8ef1b7a045401069c4e50"`);
        await queryRunner.query(`ALTER TABLE "tratamiento_tb" DROP CONSTRAINT "FK_5b00c84471e7657d0922f3ba62e"`);
        await queryRunner.query(`ALTER TABLE "tratamiento_tb" DROP CONSTRAINT "FK_f42b457cb992576c2dfc249869b"`);
        await queryRunner.query(`ALTER TABLE "tratamiento_tb" DROP CONSTRAINT "FK_b058545abe9fb1260660444a07d"`);
        await queryRunner.query(`ALTER TABLE "contacto_paciente" DROP CONSTRAINT "FK_0afe3fcdcb264d9a49b77ea55b7"`);
        await queryRunner.query(`ALTER TABLE "contacto_paciente" DROP CONSTRAINT "FK_6cb021c741413e1796b66d60abc"`);
        await queryRunner.query(`DROP TABLE "direccion"`);
        await queryRunner.query(`DROP TABLE "zona_mza"`);
        await queryRunner.query(`DROP TABLE "zona_uv"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "cita"`);
        await queryRunner.query(`DROP TABLE "estado_cita"`);
        await queryRunner.query(`DROP TABLE "tipo_cita"`);
        await queryRunner.query(`DROP TABLE "tratamiento_tb"`);
        await queryRunner.query(`DROP TABLE "fase_tratamiento"`);
        await queryRunner.query(`DROP TABLE "paciente"`);
        await queryRunner.query(`DROP TABLE "contacto_paciente"`);
        await queryRunner.query(`DROP TABLE "tipo_parentesco"`);
        await queryRunner.query(`DROP TABLE "estado_tratamiento"`);
        await queryRunner.query(`DROP TABLE "tipo_tratamiento"`);
        await queryRunner.query(`DROP TABLE "rol"`);
    }

}
