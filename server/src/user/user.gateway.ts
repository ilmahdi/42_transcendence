import { 
    WebSocketGateway, 
    SubscribeMessage, 
    WebSocketServer 
} from '@nestjs/websockets';
import { UserService } from './user.service';
import { Server, Socket } from 'socket.io';
import { ConnectionGateway } from 'src/common/gateways/connection.gateway';

@WebSocketGateway({
    cors: {
        origin: ['http://localhost:4200'],
    }
})

export class UserGateway  {
  constructor(
    private readonly userService: UserService,
    private readonly connectionGateway :ConnectionGateway,
  ) {}


  @WebSocketServer()
  server: Server

 

  @SubscribeMessage('sendMessage')
  handleMessage(socket: Socket, message: string) {
    this.server.emit('newMessage', message);
  }

}

