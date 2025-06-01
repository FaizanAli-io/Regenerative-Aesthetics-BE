import {
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddContactDetailsDto {
  @ApiProperty({
    description: 'Contact phone number',
    example: '+1234567890',
    required: true,
  })
  @IsNotEmpty({
    message: 'Phone can not be empty',
  })
  @IsString({
    message: 'Phone should be a string.',
  })
  phone: string;

  @ApiProperty({
    description: 'Street address',
    example: '123 Main Street',
    required: true,
  })
  @IsNotEmpty({
    message: 'Address can not be empty',
  })
  @IsString({
    message: 'Address should be a string.',
  })
  address: string;

  @ApiProperty({
    description: 'City name',
    example: 'New York',
    required: true,
  })
  @IsNotEmpty({
    message: 'City can not be empty',
  })
  @IsString({
    message: 'City should be a string.',
  })
  city: string;

  @ApiProperty({
    description: 'Postal/ZIP code',
    example: '10001',
    required: true,
  })
  @IsNotEmpty({
    message: 'Postal Code can not be empty',
  })
  @IsString({
    message: 'Postal Code be a string.',
  })
  postalCode: string;

  @ApiProperty({
    description: 'State/Province',
    example: 'NY',
    required: true,
  })
  @IsNotEmpty({
    message: 'State can not be empty',
  })
  @IsString({
    message: 'State should be a string.',
  })
  state: string;

  @ApiProperty({
    description: 'Country code',
    example: 'USA',
    required: true,
  })
  @IsNotEmpty({
    message: 'Country can not be empty',
  })
  @IsString({
    message: 'Country should be a string.',
  })
  country: string;

  @ApiProperty({
    description: 'Label',
    example: 'Home',
    required: true,
  })
  @IsNotEmpty({
    message: 'Label can not be empty',
  })
  @IsString({
    message: 'Label should be a string.',
  })
  label: string;
}
