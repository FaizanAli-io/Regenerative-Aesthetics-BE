import {
  Module,
  forwardRef,
} from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';

import { OrderEntity } from './entities/order.entity';
import { ShippingEntity } from './entities/shipping.entity';
import { OrdersProductsEntity } from './entities/orders-products.entity';

import { UsersModule } from './../users/users.module';
import { EmailsModule } from './../emails/emails.module';
import { ProductsModule } from './../products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      ShippingEntity,
      OrdersProductsEntity,
    ]),
    forwardRef(() => ProductsModule),
    UsersModule,
    EmailsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
