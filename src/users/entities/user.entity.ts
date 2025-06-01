import { Exclude } from 'class-transformer';
import { CategoryEntity } from './../../categories/entities/category.entity';
import { OrderEntity } from './../../orders/entities/order.entity';
import { ProductEntity } from './../../products/entities/product.entity';
import { ReviewEntity } from './../../reviews/entities/review.entity';
import { Roles } from './../../utility/common/user-roles.enum';
import { WishlistItemEntity } from './../../wishlists/entities/wishlists-items.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { AddressBookEntity } from './address-book.entity';
@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column({ unique: true })
  email: string;
  @Exclude()
  @Column({ select: false })
  password: string;
  @Exclude()
  @Column({
    type: 'enum',
    enum: Roles,
    array: true,
    default: [Roles.USER],
    enumName: 'user_role_enum',
  })
  roles: Roles[];
  @Exclude()
  @Column({ default: false })
  isVerified: boolean;
  @Exclude()
  @Column({ nullable: true })
  verificationToken: string;
  @Exclude()
  @Column({ type: 'timestamp', nullable: true })
  verificationTokenExpires: Date;
  @Exclude()
  @Column({ nullable: true })
  resetPasswordToken: string;
  @Exclude()
  @Column({ nullable: true, type: 'timestamp' })
  resetPasswordTokenExpires: Date;
  @CreateDateColumn()
  createdAt: Timestamp;
  @UpdateDateColumn()
  updatedAt: Timestamp;
  @OneToMany(
    () => CategoryEntity,
    (cat) => cat.addedBy,
  )
  categories: CategoryEntity[];
  @OneToMany(
    () => ProductEntity,
    (prod) => prod.addedBy,
  )
  products: ProductEntity[];
  @OneToMany(
    (type) => ReviewEntity,
    (rev) => rev.user,
  )
  reviews: ReviewEntity[];
  @OneToMany(
    (type) => OrderEntity,
    (order) => order.updatedBy,
  )
  ordersUpdateBy: OrderEntity[];
  @OneToMany(
    () => OrderEntity,
    (order) => order.user,
  )
  orders: OrderEntity[];
  @OneToMany(
    () => WishlistItemEntity,
    (wishlistItem) => wishlistItem.user,
  )
  wishlistItems: WishlistItemEntity[];
  @OneToMany(
    () => AddressBookEntity,
    (addBook) => addBook.user,
  )
  contactDetails: AddressBookEntity[];
}
