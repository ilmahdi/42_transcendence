import { WebSocketGateway, SubscribeMessage, WebSocketServer } from '@nestjs/websockets';
import { GameService } from './game.service';
import { ConnectionGateway } from 'src/common/gateways/connection.gateway';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
      origin: [process.env.FONTEND_URL],
  }
})
export class GameGateway {
  constructor(
    private readonly gameService: GameService,
    private readonly connectionGateway :ConnectionGateway,
  ) {
  }
  @WebSocketServer() server: Server


  inGameUsersById: { [userId: string]: string } = {}; 


  private waitingPlayers: string[] = [];
  
  @SubscribeMessage('requestOpponentId')
  handleJoinMatchmaking(client: Socket) {
    if (!this.inGameUsersById[this.connectionGateway.connectedUsersBySocket[client.id]]) {

      this.inGameUsersById[this.connectionGateway.connectedUsersBySocket[client.id]] = client.id;
      this.addToQueue(client.id);
    }
  }



  addToQueue(client: string) {
    this.waitingPlayers.push(client);
    this.tryMatchPlayers();
  }

  tryMatchPlayers() {

    if (this.waitingPlayers.length >= 2) {
      const player1 = this.waitingPlayers.shift()!;
      const player2 = this.waitingPlayers.shift()!;

      this.initializeGame(player1, player2);
    }
  }

  initializeGame(player1: string, player2: string) {

    this.server.to(player1).emit('opponentId', { 
      userId: this.connectionGateway.connectedUsersBySocket[player2],
      isToStart: false,
    });
    this.server.to(player2).emit('opponentId', { 
      userId: this.connectionGateway.connectedUsersBySocket[player1],
      isToStart: true,
    });
  }

  @SubscribeMessage('startGame')
  startGame(client: Socket, userId :string) {
    this.server.to(this.inGameUsersById[userId]).emit('startGame');
  }

  @SubscribeMessage('endGame')
  endGame(client: Socket, userId :string) {
    if (this.inGameUsersById[userId]) 
      delete this.inGameUsersById[userId];
  }
  @SubscribeMessage('paddleMove')
  paddleMove(client: Socket, data :{userId :string, paddle: {y :number} }) {

    this.server.to(this.inGameUsersById[data.userId]).emit('paddleMove', data.paddle);
  }


  
}
