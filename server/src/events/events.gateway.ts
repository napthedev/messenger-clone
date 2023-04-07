import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { ConversationService } from 'src/conversation/conversation.service';
import { validateObject } from 'src/utils/validate';
import { MessageDto } from 'src/message/dto/message.dto';
import { MessageService } from 'src/message/message.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly messageService: MessageService,
  ) {}

  handleConnection(client: Socket) {
    const authHeader = client.handshake.auth.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      client.disconnect();
      return;
    }

    try {
      const user = jwt.verify(
        authHeader.split(' ')[1],
        process.env.PRIVATE_KEY!,
      ) as any;

      client.data = { user };
    } catch (error) {
      console.log(error);
      client.disconnect();
    }
  }

  @SubscribeMessage('get-all-conversations')
  handleMessage(@ConnectedSocket() client: Socket) {
    const userId = client.data.user.id;

    this.conversationService
      .findAllConversation(userId)
      .then((result) => {
        client.emit('update-conversations-list', result);
      })
      .catch((err) => {
        console.log(err);
        client.emit('error-conversations-list');
      });
  }

  @SubscribeMessage('create-message')
  createMessage(@MessageBody() data, @ConnectedSocket() client: Socket) {
    validateObject(data, MessageDto)
      .then(() => {
        this.messageService.createMessage(data).then((message) => {
          client.emit('new-message', [message]);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  @SubscribeMessage('get-messages')
  getMessages(
    @MessageBody('conversationId') conversationId,
    @ConnectedSocket() client: Socket,
  ) {
    this.messageService
      .getMessages(conversationId)
      .then((data) => {
        client.emit('new-message', data);
      })
      .catch((err) => console.log(err));
  }
}
