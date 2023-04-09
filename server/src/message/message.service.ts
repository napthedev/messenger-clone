import { Injectable } from '@nestjs/common';
import { MessageDto } from './dto/message.dto';
import { PrismaService } from 'src/prisma.service';
import { Message } from '@prisma/client';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async createMessage(data: MessageDto) {
    return await this.prisma.message.create({ data });
  }
  async getMessages(conversationId: string) {
    return await this.prisma.message.findMany({
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
