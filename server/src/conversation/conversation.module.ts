import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [ConversationService, PrismaService],
  controllers: [ConversationController],
  exports: [ConversationService],
})
export class ConversationModule {}
