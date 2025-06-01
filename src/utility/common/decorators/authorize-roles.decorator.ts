// authorization.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const AuthorizeRoles = (
  ...roles: string[]
) => SetMetadata('allowedRoles', roles); // Key must be 'allowedRoles'
