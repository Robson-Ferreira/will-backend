import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { Env } from '../environment';

@Injectable()
export class JWTGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const token: string = request.headers.authorization;

    if (!token) {
      throw new HttpException(
        'Missing header authorization.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const [, value] = token.split(' ');

    if (!value) {
      throw new HttpException('Invalid token.', HttpStatus.BAD_REQUEST);
    }

    try {
      const decodedToken = jwt.verify(
        value,
        Env.JWT_SECRET_HASH,
      ) as jwt.JwtPayload;

      if (
        !decodedToken.hasOwnProperty('_id') ||
        !decodedToken.hasOwnProperty('email')
      ) {
        throw new HttpException('Decoding error.', HttpStatus.BAD_REQUEST);
      }

      request.email = decodedToken.email;
      request.userId = decodedToken._id;
      request.isAdmin = decodedToken.isAdmin;

      return true;
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
