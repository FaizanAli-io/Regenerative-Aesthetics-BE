import { CategoryEntity } from './../../categories/entities/category.entity';
import { OrdersProductsEntity } from './../../orders/entities/orders-products.entity';
import { ReviewEntity } from './../../reviews/entities/review.entity';
import { UserEntity } from './../../users/entities/user.entity';
import { WishlistItemEntity } from './../../wishlists/entities/wishlists-items.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
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
    {
      nullable: true,
      onDelete: 'SET NULL', // Set the category ID to null when the category is deleted
    },
  )
  category: CategoryEntity | null;
  @OneToMany(
    () => ReviewEntity,
    (rev) => rev.product,
  )
  reviews: ReviewEntity[];
  @OneToMany(
    () => OrdersProductsEntity,
    (op) => op.product,
  )
  products: OrdersProductsEntity[];
  @OneToMany(
    () => WishlistItemEntity,
    (wishlistItem) => wishlistItem.product,
  )
  wishlistedBy: WishlistItemEntity[];
}
