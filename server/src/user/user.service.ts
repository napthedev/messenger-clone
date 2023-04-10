import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async allUsersExceptCurrent(currentUserId: string) {
    return this.prisma.user.findMany({
      where: {
        id: { not: currentUserId },
      },
      select: {
        id: true,
        name: true,
        email: true,
        picture: true,
      },
    });
  }

  async userInfo(userId: string) {
    return this.prisma.user.findFirstOrThrow({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        picture: true,
      },
    });
  }
}

export type UserType = User;
export type UsersType = User[];
