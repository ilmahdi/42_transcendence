import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { TokenService } from '../services/token.service';
import { error } from 'console';



@WebSocketGateway({
    cors: {
        origin: [process.env.FONTEND_URL],
    }
  })
@WebSocketGateway()
export class ConnectionGateway implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(
      private tokenService: TokenService,
    ) {
  }
  @WebSocketServer() server: Server;

  connectedUsersBySocket: { [socketId: string]: string } = {}; 
  connectedUsersById: { [userId: string]: string[] } = {}; 
  userUserListeners: { [userId: string]: string[] } = {};
  inGameUsersById: { [userId: string]: string } = {}; 


  handleConnection(client: Socket) {

    try {
      const decodedToken = this.tokenService.verifyToken(client.handshake.headers.authorization)
      if (!decodedToken)
      {
        console.log("Error: invalid token!");
        return client.disconnect();
      }
      const socketId = client.id;
      
      this.connectedUsersBySocket[socketId] = decodedToken.sub;
      
      if (!this.connectedUsersById[decodedToken.sub]) {
        this.connectedUsersById[decodedToken.sub] = [];
      }
      this.connectedUsersById[decodedToken.sub].push(socketId);
      
      console.log(`User ${decodedToken.username} connected with socket ID ${socketId}`);

    } catch (error) {
      this.server.to(client.id).emit('errorEvent', { message: "handleConnection error" });

    }

  }
  
  handleDisconnect(client: Socket) {
    
    try {

      const socketId = client.id;
      const userId = this.connectedUsersBySocket[socketId];
      
      if (userId) {
        delete this.connectedUsersBySocket[socketId];
        console.log(`User ${userId} disconnected from socket ID ${socketId}`);
      }

    
      if (this.removeItemFromArray(this.connectedUsersById, client.id))
      this.broadcastOffline(userId)
    
      this.removeItemFromArray(this.userUserListeners, client.id)
    
    } catch (error) {
      this.server.to(client.id).emit('errorEvent', { message: "handleConnection error" });

    }

  }


  @SubscribeMessage('watchConnection')
  watchConnection(client: Socket, userId: string) {
    try {
    
      if (!this.userUserListeners[userId])
        this.userUserListeners[userId] = [];
      this.userUserListeners[userId].push(client.id);

    } catch (error) {
      this.server.to(client.id).emit('errorEvent', { message: "handleConnection error" });

    }

  }

  @SubscribeMessage('watchConnectionMany')
  watchConnectionMany(client: Socket, userIds: string[]) {
    try {
    
      for (const userId of userIds) {
        if (!this.userUserListeners[userId]) {
            this.userUserListeners[userId] = [];
        }
        this.userUserListeners[userId].push(client.id);
      }
    } catch (error) {
      this.server.to(client.id).emit('errorEvent', { message: "handleConnection error" });

    }

  }

  @SubscribeMessage('broadcastOnline')
  broadcastOnline(client: Socket, userId: string) {
    try {

      const userSocketIds = this.userUserListeners[userId];

      if (userSocketIds) {
        userSocketIds.forEach((socketId) => {

          this.server.to(socketId).emit('online', userId);
        });
      }
    } catch (error) {
      this.server.to(client.id).emit('errorEvent', { message: "handleConnection error" });

    }
  }




  /*****************************************************/

  removeItemFromArray(dictionary: { [key: string]: string[] }, socketId :string) :boolean {

    const userId = Object.keys(dictionary).find(
      (key) => dictionary[key].includes(socketId),
    );
    if (userId) {
      dictionary[userId] = dictionary[userId].filter(
        (id) => id !== socketId,
      );
      if (dictionary[userId].length === 0) {
        delete dictionary[userId];
        return true;
      }
    }
    return false;
    
  }

  broadcastOffline(userId: string) {
  
    const userSocketIds = this.userUserListeners[userId];

    if (userSocketIds) {
      userSocketIds.forEach((socketId) => {

        this.server.to(socketId).emit('offline', userId);
      });
    }
  }

  @SubscribeMessage('connectionStatus')
  connectionStatus(client: Socket, userId: string) {
    
    const userSocketIds = this.connectedUsersById[userId];
    
    if (userSocketIds) {
      if (this.inGameUsersById[userId])
        this.server.to(client.id).emit('playing', userId);
      else
        this.server.to(client.id).emit('online', userId);
    }
    else
      this.server.to(client.id).emit('offline', userId);
  }
  @SubscribeMessage('connectionStatusMany')
  connectionStatusMany(client: Socket, userIds: string[]) {
    
    for (const userId of userIds) {
      const userSocketIds = this.connectedUsersById[userId];
      
      if (userSocketIds) {
        if (this.inGameUsersById[userId])
          this.server.to(client.id).emit('playing', userId);
        else
          this.server.to(client.id).emit('online', userId);

      } else {
          this.server.to(client.id).emit('offline', userId);
      }
    }
  }


  
}
