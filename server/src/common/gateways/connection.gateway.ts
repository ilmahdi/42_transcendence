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

  connectedUsers: { [socketId: string]: string } = {}; 


  handleConnection(client: Socket) {

    const decodedToken = this.tokenService.verifyToken(client.handshake.headers.authorization)
    if (!decodedToken)
    {
      console.log("Error: invalid token!");
      return client.disconnect();
    }
    const socketId = client.id;

    this.connectedUsers[socketId] = decodedToken.sub;

    console.log(`User ${decodedToken.username} connected with socket ID ${socketId}`);
  }

  handleDisconnect(client: Socket) {
    const socketId = client.id;
    const userId = this.connectedUsers[socketId];

    if (userId) {
      delete this.connectedUsers[socketId];
      console.log(`User ${userId} disconnected from socket ID ${socketId}`);
    }
  }
}
