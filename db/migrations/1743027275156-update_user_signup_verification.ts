import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserSignupVerification1743027275156 implements MigrationInterface {
    name = 'UpdateUserSignupVerification1743027275156'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "isVerified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" ADD "verificationToken" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "verificationTokenExpires" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "verificationTokenExpires"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "verificationToken"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isVerified"`);
    }

}
