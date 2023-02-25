import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class VerifyJWTMiddleware implements NestMiddleware {
  use(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer '))
      throw new HttpException({ message: 'Forbidden' }, HttpStatus.FORBIDDEN);

    try {
      const user = jwt.verify(
        authHeader.split(' ')[1],
        process.env.PRIVATE_KEY!,
      ) as any;

      req.user = user;
      next();
    } catch (error) {
      throw new HttpException({ message: 'Forbidden' }, HttpStatus.FORBIDDEN);
    }
  }
}
