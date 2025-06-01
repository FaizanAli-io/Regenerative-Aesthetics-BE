import {
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({
    description: 'Rating from 1 to 5 stars',
    example: 5,
    minimum: 1,
    maximum: 5,
    required: true,
  })
  @IsNotEmpty({
    message: 'Rating has to be provided.',
  })
  @IsNumber(
    {},
    { message: 'Rating should be a number.' },
  )
  ratings: number;

  @ApiProperty({
    description: 'Detailed review comment',
    example:
      'Excellent product quality and fast delivery!',
    required: true,
  })
  @IsNotEmpty({
    message: 'Comment has to be provided.',
  })
  @IsString({
    message: 'Comment should be a string.',
  })
  comment: string;

  @ApiProperty({
    description:
      'ID of the product being reviewed',
    example: 1,
    required: true,
  })
  @IsNotEmpty({
    message: 'Product Id should not be empty.',
  })
  @IsNumber(
    {},
    { message: 'Product Id should be a number.' },
  )
  productId: number;
}
