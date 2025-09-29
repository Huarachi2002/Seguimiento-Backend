import { MigrationInterface, QueryRunner } from "typeorm";

export class TratamientoChange1759107850111 implements MigrationInterface {
    name = 'TratamientoChange1759107850111'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tratamiento_tb" ALTER COLUMN "codigo_tratamiento" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tratamiento_tb" ALTER COLUMN "regimen_medicacion" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tratamiento_tb" ALTER COLUMN "dosis_total" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tratamiento_tb" ALTER COLUMN "dosis_completa" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tratamiento_tb" ALTER COLUMN "dosis_completa" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tratamiento_tb" ALTER COLUMN "dosis_total" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tratamiento_tb" ALTER COLUMN "regimen_medicacion" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tratamiento_tb" ALTER COLUMN "codigo_tratamiento" SET NOT NULL`);
    }

}
