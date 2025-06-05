import {
  Module,
  RequestMethod,
  MiddlewareConsumer,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '../db/data-source';
import { CurrentUserMiddleware } from './utility/common/middlewares/current-user.middleware';
import { UsersModule } from './users/users.module';
import { BlogsModule } from './blogs/blogs.module';
import { OrdersModule } from './orders/orders.module';
import { EmailsModule } from './emails/emails.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ProductsModule } from './products/products.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    BlogsModule,
    OrdersModule,
    EmailsModule,
    ReviewsModule,
    ProductsModule,
    WishlistsModule,
    CategoriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CurrentUserMiddleware)
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
  }
}
