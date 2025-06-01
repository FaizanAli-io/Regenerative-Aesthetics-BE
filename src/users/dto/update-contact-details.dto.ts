import { PartialType } from '@nestjs/swagger';
import { AddContactDetailsDto } from './add-contact-details.dto';

export class UpdateContactDetailsDto extends PartialType(
  AddContactDetailsDto,
) {}
