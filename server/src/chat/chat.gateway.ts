import { 
  WebSocketGateway, 
  SubscribeMessage, 
  WebSocketServer, 
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { ConnectionGateway } from 'src/common/gateways/connection.gateway';

@WebSocketGateway({
  cors: {
      origin: ['http://localhost:4200'],
  }
})
export class ChatGateway {
  constructor(
      private readonly chatService: ChatService,
      private readonly connectionGateway :ConnectionGateway,
    ) {}

  @WebSocketServer()
  server: Server



  @SubscribeMessage('sendMessage')
  handleMessage(socket: Socket, message: string) {
    this.server.emit('newMessage', message);
  }

}
