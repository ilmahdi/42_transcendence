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
    private readonly connectionGateway :ConnectionGateway,
  ) {}

  @WebSocketServer()
  server: Server

 
  @SubscribeMessage('notifyFriendRequest')
  notifyUser(client: Socket, userId: string) {
    try {
      const userSocketIds = this.connectionGateway.connectedUsersById[userId];
      if (userSocketIds) {
        userSocketIds.forEach((socketId) => {

          this.server.to(socketId).emit('notifyFriendRequest', { notify: 1 });
        });
      }
    } catch (error) {
      this.server.to(client.id).emit('errorEvent', { message: "notifyFriendRequest error" });

    }
  }
  @SubscribeMessage('unNotifyFriendRequest')
  unNotifyUser(client: Socket, userId: string) {

    try {
      const userSocketIds = this.connectionGateway.connectedUsersById[userId];
      if (userSocketIds) {
        userSocketIds.forEach((socketId) => {

          this.server.to(socketId).emit('unNotifyFriendRequest', { notify: -1 });
        });
      }
    } catch (error) {
      this.server.to(client.id).emit('errorEvent', { message: "unNotifyFriendRequest error" });

    }
  }
  @SubscribeMessage('refreshUser')
  refreshUser(client: Socket, userId: string) {

    try {
      const userSocketIds = this.connectionGateway.connectedUsersById[userId];
      if (userSocketIds) {
        userSocketIds.forEach((socketId) => {

          this.server.to(socketId).emit('refreshUser');
        });
      }
    } catch (error) {
      this.server.to(client.id).emit('errorEvent', { message: "refreshUser error" });

    }
  }
 

  
  
}

