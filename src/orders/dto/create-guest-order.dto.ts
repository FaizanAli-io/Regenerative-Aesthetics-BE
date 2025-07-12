import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';

export class CreateGuestOrderDto extends CreateOrderDto {
  @ApiProperty({
    description:
      'Customer email address for order notifications',
    example: 'customer@example.com',
    required: true,
  })
  @IsNotEmpty({
    message: 'Email cannot be empty',
  })
  @IsEmail(
    {},
    {
      message:
        'Please provide a valid email address',
    },
  )
  customerEmail: string;

  @ApiProperty({
    description: 'Customer name',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString({
    message: 'Customer name should be a string',
  })
  customerName?: string;

  @ApiProperty({
    description: 'Customer phone number',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString({
    message: 'Customer phone should be a string',
  })
  customerPhone?: string;
}
