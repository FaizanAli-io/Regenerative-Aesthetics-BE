import { UserEntity } from './../../users/entities/user.entity';
import { ReviewEntity } from './../../reviews/entities/review.entity';
import { CategoryEntity } from './../../categories/entities/category.entity';
import { OrdersProductsEntity } from './../../orders/entities/orders-products.entity';
import { WishlistItemEntity } from './../../wishlists/entities/wishlists-items.entity';
import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  Timestamp,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'products' })
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  description: string;
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  price: number;
  @Column()
  stock: number;
  @Column('simple-array')
  images: string[];
  @CreateDateColumn()
  createdAt: Timestamp;
  @UpdateDateColumn()
  updatedAt: Timestamp;
  @ManyToOne(
    () => UserEntity,
    (user) => user.products,
    { onDelete: 'SET NULL' },
  )
  addedBy: UserEntity;
  @ManyToOne(
    () => CategoryEntity,
    (category) => category.products,
    { onDelete: 'SET NULL', nullable: true },
  )
  category: CategoryEntity | null;
  @OneToMany(
    () => ReviewEntity,
    (review) => review.product,
  )
  reviews: ReviewEntity[];
  @OneToMany(
    () => OrdersProductsEntity,
    (orderproduct) => orderproduct.product,
  )
  products: OrdersProductsEntity[];
  @OneToMany(
    () => WishlistItemEntity,
    (wishlistItem) => wishlistItem.product,
  )
  wishlistedBy: WishlistItemEntity[];
}
