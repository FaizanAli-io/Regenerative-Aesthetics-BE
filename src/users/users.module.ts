import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserEntity } from './entities/user.entity';
import { EmailsModule } from './../emails/emails.module';
import { AddressBookEntity } from './entities/address-book.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      AddressBookEntity,
    ]),
    EmailsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
