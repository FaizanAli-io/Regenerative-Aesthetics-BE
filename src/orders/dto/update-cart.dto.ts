// update-cart.dto.ts
import { Type } from 'class-transformer';
import {
  ValidateNested,
  IsNumber,
  IsPositive,
  IsNotEmpty,
} from 'class-validator';
import { OrderedProductsDto } from './ordered-products.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartDto {
  @Type(() => OrderedProductsDto)
  @ValidateNested()
  products: OrderedProductsDto[];
}

export class UpdateCartQuantityDto {
  @ApiProperty({
    description: 'Product ID',
    example: 1,
    required: true,
  })
  @IsNotEmpty({
    message: 'Product ID cannot be empty',
  })
  @IsNumber(
    {},
    { message: 'Product ID must be a number' },
  )
  productId: number;

  @ApiProperty({
    description: 'New quantity for the product',
    example: 2,
    minimum: 1,
    required: true,
  })
  @IsNumber(
    {},
    { message: 'Quantity must be a number' },
  )
  @IsPositive({
    message: 'Quantity must be a positive number',
  })
  quantity: number;
}
