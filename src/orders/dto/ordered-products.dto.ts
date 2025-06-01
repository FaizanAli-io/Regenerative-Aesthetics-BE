import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderedProductsDto {
  @ApiProperty({
    description: 'Product ID',
    example: 1,
    required: true,
  })
  @IsNotEmpty({
    message: 'Product can not be empty',
  })
  @IsNumber(
    {},
    { message: 'Product should be a number.' },
  )
  id: number;

  @ApiProperty({
    description: 'Quantity of the product',
    example: 2,
    minimum: 1,
    required: true,
  })
  @IsNumber(
    {},
    { message: 'Quantity should be a number.' },
  )
  @IsPositive({
    message: 'Quantity can not be negative.',
  })
  product_quantity: number;
}
