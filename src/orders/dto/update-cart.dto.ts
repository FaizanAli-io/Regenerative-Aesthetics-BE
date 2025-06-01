// update-cart.dto.ts
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { OrderedProductsDto } from './ordered-products.dto';

export class UpdateCartDto {
  @Type(() => OrderedProductsDto)
  @ValidateNested()
  products: OrderedProductsDto[];
}
