import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { ConversationModule } from 'src/conversation/conversation.module';
import { MessageModule } from 'src/message/message.module';

@Module({
  providers: [EventsGateway],
  imports: [ConversationModule, MessageModule],
})
export class EventsModule {}
