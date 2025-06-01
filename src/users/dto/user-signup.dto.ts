import {
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { UserSignInDto } from './user-signin.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UserSignUpDto extends UserSignInDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
    required: true,
    minLength: 2,
    maxLength: 50,
  })
  @IsNotEmpty({
    message: 'Name can not be empty.',
  })
  @IsString({
    message: 'Name should be a string.',
  })
  name: string;
}
