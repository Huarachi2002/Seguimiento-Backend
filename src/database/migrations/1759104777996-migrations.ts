import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1759104777996 implements MigrationInterface {
    name = 'Migrations1759104777996'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "direccion" DROP CONSTRAINT "FK_605ffaf59051653aaad1785a758"`);
        await queryRunner.query(`ALTER TABLE "direccion" DROP CONSTRAINT "REL_605ffaf59051653aaad1785a75"`);
        await queryRunner.query(`ALTER TABLE "direccion" DROP COLUMN "pacienteId"`);
        await queryRunner.query(`ALTER TABLE "paciente" ADD "direccionId" uuid`);
        await queryRunner.query(`ALTER TABLE "paciente" ADD CONSTRAINT "UQ_4d07e0fa4f3733e651b1190137f" UNIQUE ("direccionId")`);
        await queryRunner.query(`ALTER TABLE "tratamiento_tb" ALTER COLUMN "fecha_fin" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "paciente" ADD CONSTRAINT "FK_4d07e0fa4f3733e651b1190137f" FOREIGN KEY ("direccionId") REFERENCES "direccion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "paciente" DROP CONSTRAINT "FK_4d07e0fa4f3733e651b1190137f"`);
        await queryRunner.query(`ALTER TABLE "tratamiento_tb" ALTER COLUMN "fecha_fin" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "paciente" DROP CONSTRAINT "UQ_4d07e0fa4f3733e651b1190137f"`);
        await queryRunner.query(`ALTER TABLE "paciente" DROP COLUMN "direccionId"`);
        await queryRunner.query(`ALTER TABLE "direccion" ADD "pacienteId" uuid`);
        await queryRunner.query(`ALTER TABLE "direccion" ADD CONSTRAINT "REL_605ffaf59051653aaad1785a75" UNIQUE ("pacienteId")`);
        await queryRunner.query(`ALTER TABLE "direccion" ADD CONSTRAINT "FK_605ffaf59051653aaad1785a758" FOREIGN KEY ("pacienteId") REFERENCES "paciente"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
