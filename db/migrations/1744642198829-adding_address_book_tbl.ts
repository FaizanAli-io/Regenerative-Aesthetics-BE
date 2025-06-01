import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingAddressBookTbl1744642198829 implements MigrationInterface {
    name = 'AddingAddressBookTbl1744642198829'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "address_book" ("id" SERIAL NOT NULL, "phone" character varying NOT NULL, "name" character varying, "address" character varying NOT NULL, "city" character varying NOT NULL, "postalCode" character varying NOT NULL, "state" character varying NOT NULL, "country" character varying NOT NULL, "label" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_188a02dee277dd0f9e488fdf06f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "address_book" ADD CONSTRAINT "FK_b9ed809222f0f7b4ea4085016c2" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address_book" DROP CONSTRAINT "FK_b9ed809222f0f7b4ea4085016c2"`);
        await queryRunner.query(`DROP TABLE "address_book"`);
    }

}
