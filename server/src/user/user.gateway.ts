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
        origin: [process.env.FONTEND_URL],
    }
})

export class UserGateway  {
  constructor(
    private readonly userService: UserService,
    private readonly connectionGateway :ConnectionGateway,
  ) {}


  @WebSocketServer()
  server: Server

 

  @SubscribeMessage('NotifyFriendRequest')
  notifyUser(client: Socket, userId: string) {

    const userSocketIds = this.connectionGateway.connectedUsersById[userId];
    if (userSocketIds) {
      userSocketIds.forEach((socketId) => {

        this.server.to(socketId).emit('NotifyFriendRequest', { notify: 1 });
      });
    }
  }
  @SubscribeMessage('refreshUser')
  refreshUser(client: Socket, userId: string) {

    const userSocketIds = this.connectionGateway.connectedUsersById[userId];
    if (userSocketIds) {
      userSocketIds.forEach((socketId) => {

        this.server.to(socketId).emit('refreshUser');
      });
    }
  }

}

