import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { LoginOrRegisterDto } from './dto/login-or-register.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async loginOrRegister(body: LoginOrRegisterDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: { username: body.username },

      select: {
        id: true,
        username: true,
        avatar: true,
        password: true,
      },
    });

    if (existingUser) {
      const isValidPassword = await bcrypt.compare(
        body.password,
        existingUser.password,
      );

      if (!isValidPassword) {
        throw new HttpException(
          { message: 'Your password is incorrect' },
          HttpStatus.FORBIDDEN,
        );
      }

      const token = jwt.sign(
        {
          id: existingUser.id,
          username: existingUser.username,
          avatar: existingUser.avatar,
        },
        process.env.PRIVATE_KEY!,
      );

      return {
        token,
      };
    } else {
      const hashedPassword = await bcrypt.hash(body.password, 10);

      const created = await this.prisma.user.create({
        data: {
          username: body.username,
          password: hashedPassword,
        },
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      });

      const token = jwt.sign(
        {
          id: created.id,
          username: created.username,
          avatar: created.avatar,
        },
        process.env.PRIVATE_KEY!,
      );

      return {
        token,
      };
    }
  }
}
