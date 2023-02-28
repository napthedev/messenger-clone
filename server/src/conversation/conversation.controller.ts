import { Body, Controller, Post } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { UsersToConversationDto } from './dto/conversation.dto';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly service: ConversationService) {}

  @Post('/create')
  async create(@Body() body: UsersToConversationDto) {
    return await this.service.createConversation(body.userIds);
  }

  @Post('/find-conversation')
  async findConversation(@Body() body: UsersToConversationDto) {
    return await this.service.conversationsFromUsers(body.userIds);
  }
}
