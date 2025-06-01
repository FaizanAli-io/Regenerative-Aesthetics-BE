import { Expose, Type } from 'class-transformer';

export class CategoryDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  addedById: number;

  @Expose()
  parentCategoryId: number | null;
}

export class ProductList {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  price: number;

  @Expose()
  stock: number;

  @Expose()
  @Type(() => String) // Ensure proper transformation
  images: string[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  addedById: number;

  @Expose()
  reviewCount: number;

  @Expose()
  avgRating: number;

  @Expose()
  @Type(() => CategoryDto) // Now correctly references CategoryDto
  category: CategoryDto;
}

export class ProductsDto {
  @Expose()
  totalProducts: number;

  @Expose()
  limit: number;

  @Expose()
  @Type(() => ProductList)
  products: ProductList[];
}
