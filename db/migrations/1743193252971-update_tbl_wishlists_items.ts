import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTblWishlistsItems1743193252971 implements MigrationInterface {
    name = 'UpdateTblWishlistsItems1743193252971'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wishlist_items" DROP CONSTRAINT "FK_549f44d8b756e2690deb099f83b"`);
        await queryRunner.query(`ALTER TABLE "wishlist_items" DROP CONSTRAINT "FK_177397e044732e7e9c0215cd5b7"`);
        await queryRunner.query(`ALTER TABLE "wishlist_items" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "wishlist_items" DROP COLUMN "product_id"`);
        await queryRunner.query(`ALTER TABLE "wishlist_items" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "wishlist_items" ADD "productId" integer`);
        await queryRunner.query(`ALTER TABLE "wishlist_items" ADD CONSTRAINT "FK_3167e7490f12ed329a36703d980" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wishlist_items" ADD CONSTRAINT "FK_485ece8ab9b569d1c560144aa25" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wishlist_items" DROP CONSTRAINT "FK_485ece8ab9b569d1c560144aa25"`);
        await queryRunner.query(`ALTER TABLE "wishlist_items" DROP CONSTRAINT "FK_3167e7490f12ed329a36703d980"`);
        await queryRunner.query(`ALTER TABLE "wishlist_items" DROP COLUMN "productId"`);
        await queryRunner.query(`ALTER TABLE "wishlist_items" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "wishlist_items" ADD "product_id" integer`);
        await queryRunner.query(`ALTER TABLE "wishlist_items" ADD "user_id" integer`);
        await queryRunner.query(`ALTER TABLE "wishlist_items" ADD CONSTRAINT "FK_177397e044732e7e9c0215cd5b7" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wishlist_items" ADD CONSTRAINT "FK_549f44d8b756e2690deb099f83b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
