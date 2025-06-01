import {
  IsIn,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { OrderStatus } from '../enum/order-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: 'New order status',
    enum: OrderStatus,
    enumName: 'OrderStatus',
    example: OrderStatus.SHIPPED,
  })
  @IsNotEmpty({
    message: 'Order status can not be empty.',
  })
  @IsString({
    message: 'Order status should be string.',
  })
  @IsIn([
    OrderStatus.SHIPPED,
    OrderStatus.DELIVERED,
  ])
  status: OrderStatus;
}
