import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1758216535472 implements MigrationInterface {
    name = 'Migrations1758216535472'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "direccion" DROP COLUMN "latitud"`);
        await queryRunner.query(`ALTER TABLE "direccion" ADD "latitud" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "direccion" DROP COLUMN "longitud"`);
        await queryRunner.query(`ALTER TABLE "direccion" ADD "longitud" double precision NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "direccion" DROP COLUMN "longitud"`);
        await queryRunner.query(`ALTER TABLE "direccion" ADD "longitud" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "direccion" DROP COLUMN "latitud"`);
        await queryRunner.query(`ALTER TABLE "direccion" ADD "latitud" integer NOT NULL`);
    }

}
