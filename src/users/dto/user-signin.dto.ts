import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserSignInDto {
  @ApiProperty({
    description: 'Registered email address',
    example: 'user@example.com',
    required: true,
    format: 'email',
  })
  @IsNotEmpty({
    message: 'Email can not be empty.',
  })
  @IsEmail(
    {},
    { message: 'Please provide a valid email.' },
  )
  email: string;

  @ApiProperty({
    description: 'Account password',
    example: 'Password123!',
    required: true,
    minLength: 5,
    maxLength: 20,
    pattern:
      '^(?=.*[A-Z])(?=.*[a-z])(?=.*[\\d\\W]).*$',
  })
  @IsNotEmpty({
    message: 'Password can not be empty.',
  })
  @MinLength(5, {
    message:
      'Password minimum character length should be 5.',
  })
  @MaxLength(20, {
    message:
      'Password maximum character length should be 20.',
  })
  @Matches(
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    {
      message:
        'Password must contain: 1 uppercase, 1 lowercase, 1 number/special character',
    },
  )
  password: string;
}
