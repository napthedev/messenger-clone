import { Body, Controller, Post, Request } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { UsersToConversationDto } from './dto/conversation.dto';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly service: ConversationService) {}

  @Post('/create')
  create(@Body() body: UsersToConversationDto, @Request() req) {
    return this.service.createConversation([req.user.id, body.otherUserId]);
  }
}
