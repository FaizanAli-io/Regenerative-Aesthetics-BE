import { ProductEntity } from './../../products/entities/product.entity';
export class WishlistResponseDto {
  id: number;
  createdAt: Date;
  product: ProductEntity; // Use your existing Product DTO if available
}
