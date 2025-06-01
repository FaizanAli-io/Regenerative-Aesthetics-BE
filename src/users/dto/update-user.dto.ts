import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
    required: false,
    minLength: 2,
    maxLength: 50,
  })
  @IsNotEmpty({
    message: 'Name can not be empty.',
  })
  @IsString({
    message: 'Name should be a string.',
  })
  @IsOptional()
  name: string;

  @ApiProperty({
    description: 'Account password',
    example: 'Password123!',
    required: false,
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
  @IsOptional()
  password: string;
}
