import { Type } from 'class-transformer';
import { CreateShippingDto } from './create-shipping.dto';
import { ValidateNested } from 'class-validator';
import { OrderedProductsDto } from './ordered-products.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Shipping address details',
    type: () => CreateShippingDto,
    example: {
      phone: '+1234567890',
      address: '123 Main St',
      city: 'New York',
      postalCode: '10001',
      state: 'NY',
      country: 'USA',
    },
  })
  @Type(() => CreateShippingDto)
  @ValidateNested()
  shippingAddress: CreateShippingDto;

  @ApiProperty({
    description: 'List of ordered products',
    type: () => OrderedProductsDto,
    isArray: true,
    example: [{ id: 1, product_quantity: 3 }],
  })
  @Type(() => OrderedProductsDto)
  @ValidateNested()
  products: OrderedProductsDto[];
}
