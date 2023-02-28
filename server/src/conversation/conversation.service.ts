import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ConversationService {
  constructor(private prisma: PrismaService) {}

  async createConversation(userIds: string[]) {
    return await this.prisma.conversation.create({
      data: {
        userOnConversation: {
          createMany: { data: userIds.map((id) => ({ userId: id })) },
        },
      },
    });
  }

  async conversationsFromUsers(userIds: string[]) {
    return (
      await this.prisma.conversation.findMany({
        where: {
          userOnConversation: { every: { userId: { in: userIds } } },
        },
        select: {
          id: true,
          userOnConversation: {
            select: {
              user: {
                select: { id: true, email: true, name: true, picture: true },
              },
            },
          },
        },
      })
    ).filter((item) => item.userOnConversation.length === userIds.length);
  }
}
