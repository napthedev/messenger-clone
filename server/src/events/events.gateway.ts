import {
  ConnectedSocket,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { ConversationService } from 'src/conversation/conversation.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection {
  constructor(private readonly conversationService: ConversationService) {}

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
}
