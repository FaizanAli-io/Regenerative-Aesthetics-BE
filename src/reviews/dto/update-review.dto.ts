import { PartialType } from '@nestjs/swagger'; // Changed from mapped-types
import { CreateReviewDto } from './create-review.dto';

export class UpdateReviewDto extends PartialType(
  CreateReviewDto,
) {}
