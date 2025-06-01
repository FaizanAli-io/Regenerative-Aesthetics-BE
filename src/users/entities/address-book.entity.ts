import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'address_book' })
export class AddressBookEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phone: string;

  @Column({ nullable: true })
  name?: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  postalCode: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @Column()
  label: string;

  @ManyToOne(
    () => UserEntity,
    (user) => user.contactDetails,
    { onDelete: 'CASCADE' },
  )
  user: UserEntity;
}
