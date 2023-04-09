import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { ConversationService } from 'src/conversation/conversation.service';
import { MessageDto } from 'src/message/dto/message.dto';
import { MessageService } from 'src/message/message.service';
import { UsePipes, ValidationPipe } from '@nestjs/common';

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

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const authHeader = client.handshake.auth.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new WsException('Invalid credentials.');
    }

    try {
      const user = jwt.verify(
        authHeader.split(' ')[1],
        process.env.PRIVATE_KEY!,
      ) as any;

      client.data.user = user;
    } catch (error) {
      throw new WsException('Invalid credentials.');
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

  @UsePipes(
    new ValidationPipe({
      exceptionFactory(errors) {
        return new WsException(errors.join(','));
      },
    }),
  )
  @SubscribeMessage('create-message')
  createMessage(@MessageBody() data: MessageDto) {
    this.messageService.createMessage(data).then((message) => {
      this.server.to(message.conversationId).emit('new-message', [message]);
    });
  }
  @SubscribeMessage('join-room')
  getMessages(
    @MessageBody('conversationId') conversationId,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(conversationId);
    this.messageService
      .getMessages(conversationId)
      .then((data) => {
        client.emit('new-message', data);
      })
      .catch((err) => console.log(err));
  }
}
