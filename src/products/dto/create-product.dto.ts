import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product title',
    example: 'Premium Wireless Headphones',
    required: true,
  })
  @IsNotEmpty({
    message: 'Title can not be empty.',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Detailed product description',
    example:
      'Noise-cancelling Bluetooth headphones with 30-hour battery life',
    required: true,
  })
  @IsNotEmpty({
    message: 'Description can not be empty.',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Product price (USD)',
    example: 199.99,
    type: 'number',
    format: 'decimal',
    minimum: 0.01,
    required: true,
  })
  @IsNotEmpty({
    message: 'Price can not be empty.',
  })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'Price should be a number with precision of 2.',
    },
  )
  @IsPositive({
    message: 'Price should be a positive number.',
  })
  price: number;

  @ApiProperty({
    description: 'Available stock quantity',
    example: 100,
    minimum: 0,
    required: true,
  })
  @IsNotEmpty({
    message: 'Stock can not be empty.',
  })
  @IsNumber(
    {},
    { message: 'Stock should be a number.' },
  )
  @Min(0, {
    message: 'Stock can not be negative.',
  })
  stock: number;

  @ApiProperty({
    description: 'Array of image URLs',
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    type: [String],
    required: true,
  })
  @IsNotEmpty({
    message: 'Images can not be empty',
  })
  @IsArray({
    message: 'Images should be in array format.',
  })
  images: string[];

  @ApiProperty({
    description: 'ID of the product category',
    example: 1,
    required: true,
  })
  @IsNotEmpty({
    message: 'Category can not be empty',
  })
  @IsNumber(
    {},
    { message: 'Category Id should be a number' },
  )
  categoryId: number;
}
