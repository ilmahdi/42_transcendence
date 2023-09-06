import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { TokenService } from '../services/token.service';



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


  handleConnection(client: Socket) {

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
    // console.log(this.connectedUsersById)
    // console.log(this.connectedUsersBySocket)
  }
  
  handleDisconnect(client: Socket) {
    
    const socketId = client.id;
    const userId = this.connectedUsersBySocket[socketId];
    
    if (userId) {
      delete this.connectedUsersBySocket[socketId];
      console.log(`User ${userId} disconnected from socket ID ${socketId}`);
    }

    
    if (this.removeItemFromArray(this.connectedUsersById, client.id))
    this.broadcastOffline(userId)
  
  this.removeItemFromArray(this.userUserListeners, client.id)
    

  }


  @SubscribeMessage('watchConnection')
  watchConnection(client: Socket, userId: string) {
    
    if (!this.userUserListeners[userId])
      this.userUserListeners[userId] = [];
    this.userUserListeners[userId].push(client.id);

  }

  @SubscribeMessage('watchConnectionMany')
  watchConnectionMany(client: Socket, userIds: string[]) {
    
    for (const userId of userIds) {
      if (!this.userUserListeners[userId]) {
          this.userUserListeners[userId] = [];
      }
      this.userUserListeners[userId].push(client.id);
    }

  }

  @SubscribeMessage('broadcastOnline')
  broadcastOnline(client: Socket, userId: string) {

    const userSocketIds = this.userUserListeners[userId];

    if (userSocketIds) {
      userSocketIds.forEach((socketId) => {

        this.server.to(socketId).emit('online', userId);
      });
    }
  }




  /****************************************************8 */

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


  
}
