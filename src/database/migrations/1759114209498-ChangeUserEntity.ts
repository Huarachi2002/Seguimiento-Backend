import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeUserEntity1759114209498 implements MigrationInterface {
    name = 'ChangeUserEntity1759114209498'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "constrasena" TO "contrasena"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "contrasena" TO "constrasena"`);
    }

}
