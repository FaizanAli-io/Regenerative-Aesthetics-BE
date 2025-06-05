import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedBlogs1749122013491 implements MigrationInterface {
    name = 'AddedBlogs1749122013491'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "blog_entity" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "content" character varying NOT NULL, "image_url" character varying NOT NULL, CONSTRAINT "PK_a47f5df4eee558a88031ed72821" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "blog_entity"`);
    }

}
