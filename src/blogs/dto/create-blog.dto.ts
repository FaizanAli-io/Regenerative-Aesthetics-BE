import {
  IsNotEmpty,
  IsString,
  IsUrl,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogDto {
  @ApiProperty({
    description: 'Title of the blog',
    example:
      'Top 10 Programming Languages in 2025',
    required: true,
  })
  @IsNotEmpty({
    message: 'Title can not be empty.',
  })
  @IsString({
    message: 'Title should be string.',
  })
  title: string;

  @ApiProperty({
    description: 'Content of the blog',
    example:
      'In this article, we explore the top programming languages...',
    required: true,
  })
  @IsNotEmpty({
    message: 'Content can not be empty.',
  })
  @IsString({
    message: 'Content should be string.',
  })
  content: string;

  @ApiProperty({
    description: 'Image URL for the blog',
    example: 'https://example.com/image.png',
    required: true,
  })
  @IsNotEmpty({
    message: 'Image URL can not be empty.',
  })
  @IsUrl(
    {},
    { message: 'Image URL must be a valid URL.' },
  )
  image_url: string;
}
