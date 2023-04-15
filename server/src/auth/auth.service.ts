import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { LoginOrRegisterDto } from './dto/login-or-register.dto';
import * as jwt from 'jsonwebtoken';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async loginOrRegister(body: LoginOrRegisterDto) {
    const response = (
      await axios.get(
        `https://graph.facebook.com/me?access_token=${body.token}&fields=id,name,email,picture.width(200).height(200)`,
      )
    ).data as {
      id: string;
      name: string;
      email?: string;
      picture: {
        data: {
          height: number;
          is_silhouette: boolean;
          url?: string;
          width: number;
        };
      };
    };

    const existingUser = await this.prisma.user.findFirst({
      where: { id: response.id },

      select: {
        id: true,
        name: true,
        email: true,
        picture: true,
      },
    });

    if (existingUser) {
      const token = jwt.sign(
        {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          picture: existingUser.picture,
        },
        process.env.PRIVATE_KEY!,
      );

      return {
        token,
      };
    } else {
      await this.prisma.user.create({
        data: {
          id: response.id,
          email: response.email,
          name: response.name,
          picture: response?.picture?.data?.url,
        },
      });

      const token = jwt.sign(
        {
          id: response.id,
          email: response.email,
          name: response.name,
          picture: response.picture.data.url,
        },
        process.env.PRIVATE_KEY!,
      );

      return {
        token,
      };
    }
  }

  async addPushToken(token: string, userId: string) {
    try {
      await this.prisma.pushToken.findUniqueOrThrow({ where: { token } });
    } catch (error) {
      return this.prisma.pushToken.create({ data: { token, userId } });
    }
  }
}
