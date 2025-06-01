import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatingCategoriesAddingHierarchy1743625238269 implements MigrationInterface {
    name = 'UpdatingCategoriesAddingHierarchy1743625238269'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" ADD "parentCategoryId" integer`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_ccde635bce518afe7c110858cc4" FOREIGN KEY ("parentCategoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_ccde635bce518afe7c110858cc4"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "parentCategoryId"`);
    }

}
