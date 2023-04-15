import { Injectable } from '@nestjs/common';
import { MessageDto } from './dto/message.dto';
import { PrismaService } from 'src/prisma.service';
import { Message } from '@prisma/client';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async createMessage(data: MessageDto) {
    const [result] = await this.prisma.$transaction([
      this.prisma.message.create({
        data,
        select: {
          id: true,
          type: true,
          content: true,
          createdAt: true,
          userId: true,
          user: { select: { name: true } },
          conversationId: true,
          conversation: {
            select: { userOnConversation: { select: { userId: true } } },
          },
        },
      }),
      this.prisma.conversation.update({
        where: { id: data.conversationId },
        data: { updatedAt: new Date() },
      }),
    ]);
    return result;
  }
  getMessages(conversationId: string) {
    return this.prisma.message.findMany({
      where: {
        conversationId,
      },
      select: {
        id: true,
        type: true,
        content: true,
        createdAt: true,
        userId: true,
        conversationId: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}

export type MessageType = Message;
