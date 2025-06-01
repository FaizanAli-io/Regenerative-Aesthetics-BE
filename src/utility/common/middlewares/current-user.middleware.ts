import {
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { isArray } from 'class-validator';
import {
  NextFunction,
  Request,
  Response,
} from 'express';
import { verify } from 'jsonwebtoken';
import { UserEntity } from './../../../users/entities/user.entity';
import { UsersService } from './../../../users/users.service';
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserEntity | null;
    }
  }
}
@Injectable()
export class CurrentUserMiddleware
  implements NestMiddleware
{
  constructor(
    private readonly userService: UsersService,
  ) {}
  async use(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const authHeader =
      req.headers.authorization ||
      req.headers.Authorization;
    if (
      !authHeader ||
      isArray(authHeader) ||
      !authHeader.startsWith('Bearer ')
    ) {
      req.currentUser = null;
      next();
      return;
    } else {
      try {
        const token = authHeader.split(' ')[1];
        console.log(token);
        const { id } = <JwtPayload>(
          verify(
            token,
            process.env
              .ACCESS_TOKEN_SECRET_KEY as string,
          )
        );
        const currentUser =
          await this.userService.findOne(+id);
        req.currentUser = currentUser;
        console.log(currentUser);
        next();
      } catch (err) {
        req.currentUser = null;
        next();
      }
    }
  }
}
interface JwtPayload {
  id: string;
}
