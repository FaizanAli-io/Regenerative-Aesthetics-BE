// authorization.guard.ts
import {
  CanActivate,
  ExecutionContext,
  mixin,
  UnauthorizedException,
} from '@nestjs/common';

// Define a factory function that returns a guard class
export const AuthorizeGuard = (
  allowedRoles: string[],
) => {
  class RolesGuardMixin implements CanActivate {
    canActivate(
      context: ExecutionContext,
    ): boolean {
      const request = context
        .switchToHttp()
        .getRequest();
      const userRoles: string[] =
        request.currentUser?.roles || [];

      // Check if user has ANY allowed role
      const hasPermission = userRoles.some(
        (role) => allowedRoles.includes(role),
      );

      if (hasPermission) return true;
      throw new UnauthorizedException(
        'Sorry, you are not authorized.',
      );
    }
  }

  // Return the mixed-in guard class
  return mixin(RolesGuardMixin);
};

// authorization.guard.ts
// export const AuthorizeGuard = (
//   allowedRoles: string[],
// ) => {
//   class RolesGuardMixin implements CanActivate {
//     canActivate(
//       context: ExecutionContext,
//     ): boolean {
//       const request = context
//         .switchToHttp()
//         .getRequest();
//       const user = request.currentUser; // Set by AuthenticationGuard

//       if (!user)
//         throw new UnauthorizedException(
//           'User not authenticated',
//         );

//       const hasRole = allowedRoles.some((role) =>
//         user.roles.includes(role),
//       );
//       if (!hasRole)
//         throw new UnauthorizedException(
//           'Insufficient permissions',
//         );

//       return true;
//     }
//   }
//   return mixin(RolesGuardMixin);
// };
