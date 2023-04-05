import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { ConversationModule } from 'src/conversation/conversation.module';

@Module({
  providers: [EventsGateway],
  imports: [ConversationModule],
})
export class EventsModule {}
