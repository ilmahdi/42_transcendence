import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
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

    
    const userId2 = Object.keys(this.connectedUsersById).find(
      (key) => this.connectedUsersById[key].includes(client.id),
    );
    if (userId2) {
      this.connectedUsersById[userId2] = this.connectedUsersById[userId2].filter(
        (id) => id !== client.id,
      );
      if (this.connectedUsersById[userId2].length === 0) {
        delete this.connectedUsersById[userId2];
      }
    }

  }
}
