import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  Repository,
} from 'typeorm';
import { ProductEntity } from './../products/entities/product.entity';
import { WishlistItemEntity } from './entities/wishlists-items.entity';
@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(WishlistItemEntity)
    private readonly wishlistRepository: Repository<WishlistItemEntity>,
    // Change this line:
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}
  async addToWishlist(
    userId: number,
    productId: number,
  ): Promise<WishlistItemEntity> {
    // Check if product exists
    const product =
      await this.productRepository.findOne({
        where: { id: productId },
      });
    if (!product)
      throw new NotFoundException(
        'Product not found',
      );
    // Check if already in wishlist
    const existing =
      await this.wishlistRepository.findOne({
        where: {
          user: { id: userId },
          product: { id: productId },
        },
      });
    if (existing)
      throw new ConflictException(
        'Product already in wishlist',
      );
    const wishlistItem =
      this.wishlistRepository.create({
        user: { id: userId },
        product: { id: productId },
      });
    return await this.wishlistRepository.save(
      wishlistItem,
    );
  }
  async getUserWishlist(
    userId: number,
    query: any,
  ): Promise<{
    wishlistItems: any[];
    totalItems: number;
    limit: number;
  }> {
    const limit = query.limit || 10;
    const queryBuilder = this.wishlistRepository
      .createQueryBuilder('wishlistItem')
      .leftJoinAndSelect(
        'wishlistItem.product',
        'product',
      )
      .where('wishlistItem.userId = :userId', {
        userId,
      })
      .orderBy('wishlistItem.createdAt', 'DESC');
    const totalItems =
      await queryBuilder.getCount();
    if (query.search) {
      queryBuilder.andWhere(
        'product.title ILIKE :search',
        {
          search: `%${query.search}%`,
        },
      );
    }
    if (query.category) {
      queryBuilder.andWhere(
        'product.categoryId = :categoryId',
        {
          categoryId: query.category,
        },
      );
    }
    queryBuilder.take(limit);
    if (query.offset)
      queryBuilder.skip(query.offset);
    const wishlistItems =
      await queryBuilder.getMany();
    return {
      wishlistItems: wishlistItems.map(
        (item) => ({
          ...item,
          product: item.product,
        }),
      ),
      totalItems,
      limit,
    };
  }
  async removeFromWishlist(
    userId: number,
    productId: number,
  ): Promise<DeleteResult> {
    const result =
      await this.wishlistRepository.delete({
        user: { id: userId },
        product: { id: productId },
      });
    if (result.affected === 0) {
      throw new NotFoundException(
        'Wishlist item not found',
      );
    }
    return result;
  }
  async checkIfWishlisted(
    userId: number,
    productId: number,
  ): Promise<boolean> {
    const exists =
      await this.wishlistRepository.findOne({
        where: {
          user: { id: userId },
          product: { id: productId },
        },
      });
    return !!exists;
  }
}
