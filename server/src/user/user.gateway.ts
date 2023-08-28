import { 
    WebSocketGateway, 
    SubscribeMessage, 
    OnGatewayConnection,
    OnGatewayDisconnect, 
    WebSocketServer 
} from '@nestjs/websockets';
import { UserService } from './user.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: ['http://localhost:4200'],
    }
})

export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect{
  constructor(private readonly userService: UserService) {}

  @WebSocketServer()
  server: Server

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId;
    console.log(`User ${userId} connected`);

  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId;
    console.log(`User ${userId} disconnected`);

  }

  @SubscribeMessage('sendMessage')
  handleMessage(socket: Socket, message: string) {
    this.server.emit('newMessage', message);
  }

}

