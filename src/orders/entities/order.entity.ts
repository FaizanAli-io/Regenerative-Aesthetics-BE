import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';
import { OrderStatus } from '../enum/order-status.enum';
import { UserEntity } from './../../users/entities/user.entity';
import { ShippingEntity } from './shipping.entity';
import { OrdersProductsEntity } from './orders-products.entity';
import { Expose, Type } from 'class-transformer';
@Entity({ name: 'orders' })
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn()
  orderAt: Timestamp;
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PROCESSING,
    enumName: 'order_status_enum',
  })
  status: string;
  @Column({ nullable: true })
  shippedAt: Date;
  @Column({ nullable: true })
  deliveredAt: Date;
  @ManyToOne(
    () => UserEntity,
    (user) => user.ordersUpdateBy,
    { onDelete: 'SET NULL' },
  )
  updatedBy: UserEntity;
  @OneToOne(
    () => ShippingEntity,
    (ship) => ship.order,
    { nullable: true, cascade: true },
  )
  @JoinColumn()
  shippingAddress?: ShippingEntity;
  @OneToMany(
    () => OrdersProductsEntity,
    (op) => op.order,
    { cascade: true },
  )
  @Type(() => OrdersProductsEntity)
  products: OrdersProductsEntity[];
  @Expose()
  get totalAmount(): number {
    if (!this.products) return 0;
    return this.products.reduce((sum, p) => {
      return (
        sum +
        Number(p.product_unit_price) *
          p.product_quantity
      );
    }, 0);
  }
  @ManyToOne(
    () => UserEntity,
    (user) => user.orders,
  )
  user: UserEntity;
}
