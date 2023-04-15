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

  findAllConversation(userId: string) {
    return this.prisma.conversation.findMany({
      where: {
        userOnConversation: {
          some: { userId: { equals: userId } },
        },
      },
      select: {
        id: true,
        userOnConversation: {
          where: { userId: { not: userId } },
          select: {
            user: {
              select: {
                id: true,
                name: true,
                picture: true,
                email: true,
              },
            },
          },
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            type: true,
            content: true,
            user: { select: { name: true } },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }
}

export type Conversations = {
  id: string;
  userOnConversation: {
    user: {
      id: string;
      email: string;
      name: string;
      picture: string;
    };
  }[];
  messages: {
    user: {
      name: string;
    };
    type: string;
    content: string;
  }[];
}[];
