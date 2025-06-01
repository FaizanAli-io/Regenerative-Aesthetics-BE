import { ProductEntity } from './../../products/entities/product.entity';
import { UserEntity } from './../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
@Entity({ name: 'reviews' })
export class ReviewEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  ratings: number;
  @Column()
  comment: string;
  @CreateDateColumn()
  createdAt: Timestamp;
  @UpdateDateColumn()
  updatedAt: Timestamp;
  @ManyToOne(
    (type) => UserEntity,
    (user) => user.reviews,
    { onDelete: 'CASCADE' },
  )
  user: UserEntity;
  @ManyToOne(
    (type) => ProductEntity,
    (prod) => prod.reviews,
    { onDelete: 'CASCADE' },
  )
  product: ProductEntity;
}
