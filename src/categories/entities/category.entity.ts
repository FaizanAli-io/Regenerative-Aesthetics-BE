import { ProductEntity } from './../../products/entities/product.entity';
import { UserEntity } from './../../users/entities/user.entity';
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
@Entity({ name: 'categories' })
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  description: string;
  @CreateDateColumn()
  createdAt: Timestamp;
  @UpdateDateColumn()
  updatedAt: Timestamp;
  @ManyToOne(
    () => UserEntity,
    (user) => user.categories,
    { onDelete: 'SET NULL' },
  )
  addedBy: UserEntity;
  @OneToMany(
    () => ProductEntity,
    (prod) => prod.category,
  )
  products: ProductEntity[];
  @ManyToOne(
    () => CategoryEntity,
    (category) => category.children,
    {
      nullable: true, // ✅ Fixes the issue
      onDelete: 'SET NULL',
    },
  )
  parentCategory: CategoryEntity | null;
  @OneToMany(
    () => CategoryEntity,
    (category) => category.parentCategory,
  )
  children: CategoryEntity[];
}
