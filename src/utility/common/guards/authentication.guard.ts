import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';

@Injectable()
export class AuthenticationGuard
  implements CanActivate
{
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const request = context
      .switchToHttp()
      .getRequest();
    return request.currentUser;
  }
}

// ✅ Fixed AuthenticationGuard
// import {
//   CanActivate,
//   ExecutionContext,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { UsersService } from 'src/users/users.service';

// @Injectable()
// export class AuthenticationGuard
//   implements CanActivate
// {
//   constructor(
//     private jwtService: JwtService,
//     private userService: UsersService,
//   ) {}

//   async canActivate(
//     context: ExecutionContext,
//   ): Promise<boolean> {
//     const request = context
//       .switchToHttp()
//       .getRequest();
//     const token =
//       request.headers.authorization?.split(
//         ' ',
//       )[1];

//     if (!token)
//       throw new UnauthorizedException(
//         'Token not provided',
//       );

//     try {
//       const payload = this.jwtService.verify(
//         token,
//         {
//           secret:
//             process.env.ACCESS_TOKEN_SECRET_KEY,
//         },
//       );
//       const user = await this.userService.findOne(
//         payload.id,
//       );
//       if (!user)
//         throw new UnauthorizedException(
//           'User not found',
//         );

//       request.currentUser = user; // Attach user to request
//       return true;
//     } catch (err) {
//       throw new UnauthorizedException(
//         'Invalid token',
//       );
//     }
//   }
// }
