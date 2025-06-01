import { PartialType } from '@nestjs/swagger'; // Changed from mapped-types
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(
  CreateCategoryDto,
) {}
