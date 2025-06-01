import {
  Inject,
  Injectable,
  forwardRef,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UserEntity } from './../users/entities/user.entity';
import { OrderStatus } from './../orders/enum/order-status.enum';
import { OrdersService } from './../orders/orders.service';
import { CategoriesService } from './../categories/categories.service';
import dataSource from './../../db/data-source';
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly categoryService: CategoriesService,
    @Inject(forwardRef(() => OrdersService))
    private readonly orderService: OrdersService,
  ) {}
  async create(
    createProductDto: CreateProductDto,
    currentUser: UserEntity,
  ): Promise<ProductEntity> {
    const category =
      await this.categoryService.findOne(
        +createProductDto.categoryId,
      );
    if (!category)
      throw new NotFoundException(
        'Category not found',
      );
    const product = this.productRepository.create(
      createProductDto,
    );
    product.category = category;
    product.addedBy = currentUser;
    return await this.productRepository.save(
      product,
    );
  }
  async findAll(query: any): Promise<{
    products: any;
    totalProducts: number;
    limit: number;
  }> {
    let limit = query.limit ? query.limit : 10;
    const queryBuilder = dataSource
      .getRepository(ProductEntity)
      .createQueryBuilder('product')
      .leftJoinAndSelect(
        'product.category',
        'category',
      )
      .leftJoin('product.reviews', 'review')
      .select([
        'product.id AS "id"',
        'product.title AS "title"',
        'product.description AS "description"',
        'product.price AS "price"',
        'product.stock AS "stock"',
        'product.images AS "images"',
        'product.createdAt AS "createdAt"',
        'product.updatedAt AS "updatedAt"',
        'product.addedById AS "addedById"',
        'category.id AS "categoryId"',
        'category.title AS "categoryTitle"',
        'category.description AS "categoryDescription"',
        'category.createdAt AS "categoryCreatedAt"',
        'category.updatedAt AS "categoryUpdatedAt"',
        'category.addedById AS "categoryAddedById"',
        'category.parentCategoryId AS "categoryParentId"',
        'COUNT(review.id) AS "reviewCount"',
        'AVG(review.ratings)::numeric(10,2) AS "avgRating"',
      ])
      .groupBy('product.id, category.id');
    const totalProducts =
      await queryBuilder.getCount();
    // Handle category filter (including children)
    if (query.category) {
      const categoryIds =
        await this.categoryService.getCategoryAndChildrenIds(
          query.category,
        );
      queryBuilder.andWhere(
        'category.id IN (:...ids)',
        {
          ids: categoryIds,
        },
      );
    }
    if (query.search) {
      queryBuilder.andWhere(
        'product.title LIKE :title',
        {
          title: `%${query.search}%`,
        },
      );
    }
    if (query.minPrice) {
      queryBuilder.andWhere(
        'product.price >= :minPrice',
        {
          minPrice: query.minPrice,
        },
      );
    }
    if (query.maxPrice) {
      queryBuilder.andWhere(
        'product.price <= :maxPrice',
        {
          maxPrice: query.maxPrice,
        },
      );
    }
    if (query.minRating) {
      queryBuilder.andHaving(
        'AVG(review.ratings) >= :minRating',
        {
          minRating: query.minRating,
        },
      );
    }
    if (query.maxRating) {
      queryBuilder.andHaving(
        'AVG(review.ratings) <= :maxRating',
        {
          maxRating: query.maxRating,
        },
      );
    }
    queryBuilder.limit(limit);
    if (query.offset) {
      queryBuilder.offset(query.offset);
    }
    const products =
      await queryBuilder.getRawMany();
    console.log(products);
    const formattedProducts = products.map(
      (product) => {
        console.log(
          'Product before formatting:',
          product,
        ); // Debugging log
        return {
          id: product.id,
          title: product.title,
          description: product.description,
          price: parseFloat(product.price), // Ensure numeric price
          stock: product.stock,
          images: product.images
            ? product.images.split(',')
            : [], // Convert to array
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
          addedById: product.addedById,
          reviewCount: parseInt(
            product.reviewCount,
            10,
          ),
          avgRating: product.avgRating
            ? parseFloat(product.avgRating)
            : null,
          category: product.categoryId
            ? {
                id: product.categoryId,
                title: product.categoryTitle,
                description:
                  product.categoryDescription,
                createdAt:
                  product.categoryCreatedAt,
                updatedAt:
                  product.categoryUpdatedAt,
                addedById:
                  product.categoryAddedById,
                parentCategoryId:
                  product.categoryParentId,
              }
            : null,
        };
      },
    );
    console.log(
      'Formatted Products:',
      formattedProducts,
    ); // Debugging log
    return {
      totalProducts,
      limit,
      products: formattedProducts,
    };
  }
  async findOne(id: number) {
    const product =
      await this.productRepository.findOne({
        where: { id: id },
        relations: {
          addedBy: true,
          category: true,
        },
        select: {
          addedBy: {
            id: true,
            name: true,
            email: true,
          },
          category: {
            id: true,
            title: true,
            description: true,
          },
        },
      });
    if (!product)
      throw new NotFoundException(
        'Product not found.',
      );
    return product;
  }
  async update(
    id: number,
    fields: Partial<UpdateProductDto>,
    currentUser: UserEntity,
  ): Promise<ProductEntity> {
    const product = await this.findOne(id);
    Object.assign(product, fields);
    product.addedBy = currentUser;
    if (fields.categoryId) {
      const category =
        await this.categoryService.findOne(
          +fields.categoryId,
        );
      if (!category)
        throw new NotFoundException(
          'Category not found',
        );
      product.category = category;
    }
    return await this.productRepository.save(
      product,
    );
  }
  async remove(id: number) {
    const product = await this.findOne(id);
    const order =
      await this.orderService.findOneByProductId(
        product.id,
      );
    if (order)
      throw new BadRequestException(
        'Products is in use.',
      );
    return await this.productRepository.remove(
      product,
    );
  }
  async updateStock(
    id: number,
    stock: number,
    status: string,
  ) {
    let product = await this.findOne(id);
    if (status === OrderStatus.DELIVERED) {
      product.stock -= stock;
    } else {
      product.stock += stock;
    }
    product =
      await this.productRepository.save(product);
    return product;
  }
}
