import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ConversationService {
  constructor(private prisma: PrismaService) {}

  async createConversation(userIds: string[]) {
    try {
      const existingConversation =
        await this.prisma.conversation.findFirstOrThrow({
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
        });
      return existingConversation;
    } catch (error) {
      const newConversation = await this.prisma.conversation.create({
        data: {
          userOnConversation: {
            createMany: { data: userIds.map((id) => ({ userId: id })) },
          },
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
      });
      return newConversation;
    }
  }
}
