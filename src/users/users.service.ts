import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { MoreThan, Repository } from 'typeorm';
import { UserSignUpDto } from './dto/user-signup.dto';
import { hash, compare } from 'bcrypt';
import { UserSignInDto } from './dto/user-signin.dto';
import { sign } from 'jsonwebtoken';
import { EmailsService } from './../emails/emails.service';
import * as crypto from 'crypto';
import { AddContactDetailsDto } from './dto/add-contact-details.dto';
import { AddressBookEntity } from './entities/address-book.entity';
import { UpdateContactDetailsDto } from './dto/update-contact-details.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(AddressBookEntity)
    private addressBookRepository: Repository<AddressBookEntity>,
    private emailService: EmailsService,
  ) {}
  async signup(
    userSignUpDto: UserSignUpDto,
  ): Promise<UserEntity> {
    const userExists = await this.findUserByEmail(
      userSignUpDto.email,
    );
    if (userExists)
      throw new BadRequestException(
        'Email is not available.',
      );
    userSignUpDto.password = await hash(
      userSignUpDto.password,
      10,
    );
    const verificationToken = crypto
      .randomBytes(20)
      .toString('hex');
    const verificationTokenExpires = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    );
    let user = this.usersRepository.create({
      ...userSignUpDto,
      isVerified: false, //while in developement this is true, otherwise false.
      verificationToken,
      verificationTokenExpires,
    });
    user = await this.usersRepository.save(user);
    //IMP: email service is not yet complete so this is commented:
    await this.emailService.sendVerificationEmail(
      user.email,
      verificationToken,
    );
    delete (user as any).password;
    return user;
  }
  async verifyEmailToken(
    token: string,
  ): Promise<UserEntity> {
    const user =
      await this.usersRepository.findOne({
        where: {
          verificationToken: token,
          verificationTokenExpires: MoreThan(
            new Date(),
          ),
        },
      });
    if (!user)
      throw new BadRequestException(
        'Invalid or expired token.',
      );
    user.isVerified = true;
    return this.usersRepository.save(user);
  }
  async signin(
    userSignInDto: UserSignInDto,
  ): Promise<UserEntity> {
    const userExists = await this.usersRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.email=:email', {
        email: userSignInDto.email,
      })
      .getOne();
    if (!userExists)
      throw new BadRequestException(
        'Bad credentials.',
      );
    const matchPassword = await compare(
      userSignInDto.password,
      userExists.password,
    );
    if (!matchPassword)
      throw new BadRequestException(
        'Bad credentials.',
      );
    if (!userExists.isVerified) {
      throw new BadRequestException(
        'Email not verified.',
      );
    }
    delete (userExists as any).password;
    return userExists;
  }
  async requestPasswordReset(
    email: string,
  ): Promise<void> {
    const user =
      await this.findUserByEmail(email);
    if (!user) return; // prevent email enumeration
    const resetToken = crypto
      .randomBytes(32)
      .toString('hex');
    const resetTokenExpires = new Date(
      Date.now() + 60 * 60 * 1000,
    ); // 1 hour expiry
    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpires =
      resetTokenExpires;
    await this.usersRepository.save(user);
    await this.emailService.sendResetPasswordEmail(
      user.email,
      resetToken,
    );
  }
  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<void> {
    const user =
      await this.usersRepository.findOne({
        where: {
          resetPasswordToken: token,
          resetPasswordTokenExpires: MoreThan(
            new Date(),
          ),
        },
      });
    if (!user) {
      throw new BadRequestException(
        'Invalid or expired token.',
      );
    }
    user.password = await hash(newPassword, 10);
    await this.usersRepository.save(user);
  }
  async accessToken(
    user: UserEntity,
  ): Promise<string> {
    return sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env
        .ACCESS_TOKEN_SECRET_KEY as string,
      {
        expiresIn: process.env
          .ACCESS_TOKEN_EXPIRE_TIME
          ? parseInt(
              process.env
                .ACCESS_TOKEN_EXPIRE_TIME,
              10,
            )
          : 3600,
      },
    );
  }
  async findAll(): Promise<UserEntity[]> {
    return await this.usersRepository.find();
  }
  async findOne(id: number) {
    const user =
      await this.usersRepository.findOneBy({
        id,
      });
    if (!user)
      throw new NotFoundException(
        `User ${id} not found.`,
      );
    return user;
  }
  async update(
    id: number,
    fields: Partial<UpdateUserDto>,
  ) {
    const user = await this.findOne(id);
    if (fields.name)
      (await user).name = fields.name;
    if (fields.password)
      (await user).password = fields.password;
    return await this.usersRepository.save(user);
  }
  async findUserByEmail(email: string) {
    return await this.usersRepository.findOneBy({
      email,
    });
  }
  async addContactDetails(
    currentUser: UserEntity,
    addContactDetailsDto: AddContactDetailsDto,
  ): Promise<AddressBookEntity> {
    let contactDetails = new AddressBookEntity();
    contactDetails.address =
      addContactDetailsDto.address;
    contactDetails.city =
      addContactDetailsDto.city;
    contactDetails.country =
      addContactDetailsDto.country;
    contactDetails.phone =
      addContactDetailsDto.phone;
    contactDetails.postalCode =
      addContactDetailsDto.postalCode;
    contactDetails.state =
      addContactDetailsDto.state;
    contactDetails.label =
      addContactDetailsDto.label;
    contactDetails.name = currentUser.name;
    contactDetails.user = currentUser;
    return await this.addressBookRepository.save(
      contactDetails,
    );
  }
  async getContactDetails(
    currentUser: UserEntity,
  ): Promise<AddressBookEntity[]> {
    return await this.addressBookRepository.find({
      where: { user: { id: currentUser.id } },
    });
  }
  async updateContactDetails(
    id: number,
    currentUser: UserEntity,
    updateContactDetailsDto: UpdateContactDetailsDto,
  ) {
    const record =
      await this.addressBookRepository.findOne({
        where: {
          id: id,
          user: { id: currentUser.id },
        },
      });
    if (!record)
      throw new NotFoundException(
        'Invalid or unauthorized contact details id.',
      );
    if (updateContactDetailsDto.address)
      record.address =
        updateContactDetailsDto.address;
    if (updateContactDetailsDto.city)
      record.city = updateContactDetailsDto.city;
    if (updateContactDetailsDto.country)
      record.country =
        updateContactDetailsDto.country;
    if (updateContactDetailsDto.label)
      record.label =
        updateContactDetailsDto.label;
    if (updateContactDetailsDto.phone)
      record.phone =
        updateContactDetailsDto.phone;
    if (updateContactDetailsDto.postalCode)
      record.postalCode =
        updateContactDetailsDto.postalCode;
    if (updateContactDetailsDto.state)
      record.state =
        updateContactDetailsDto.state;
    return await this.addressBookRepository.save(
      record,
    );
  }
  async deleteContactDetails(
    id: number,
    currentUser: UserEntity,
  ) {
    const result =
      await this.addressBookRepository.delete({
        id: id,
        user: { id: currentUser.id },
      });
    if (result.affected === 0) {
      throw new NotFoundException(
        'Invalid or unauthorized contact details id.',
      );
    }
    return {
      message: 'Contact deleted successfully.',
    };
  }
}
