import { Type } from 'class-transformer';
import { OrderedProductsDto } from './ordered-products.dto';
import { ValidateNested } from 'class-validator';

export class CreateCartDto {
  @Type(() => OrderedProductsDto)
  @ValidateNested()
  products: OrderedProductsDto[];
}
