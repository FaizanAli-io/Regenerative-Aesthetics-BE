// src/wishlists/entities/wishlist-item.entity.ts
import { ProductEntity } from './../../products/entities/product.entity';
import { UserEntity } from './../../users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
@Entity('wishlist_items')
export class WishlistItemEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn()
  createdAt: Date;
  @ManyToOne(
    () => UserEntity,
    (user) => user.wishlistItems,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn()
  user: UserEntity;
  @ManyToOne(() => ProductEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  product: ProductEntity;
}
