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
    const userId1 = this.connectionGateway.connectedUsersBySocket[player2];
    const userId2 = this.connectionGateway.connectedUsersBySocket[player1];

    this.gameService.createGame(this.server, this.getGameId(userId1, userId2), player1, player2);

    this.server.to(player1).emit('opponentId', { 
      userId: userId1,
      isToStart: false,
    });

    this.server.to(player2).emit('opponentId', { 
      userId: userId2,
      isToStart: true,
    });

  }

  @SubscribeMessage('startGame')
  startGame(client: Socket, userIds :{ player1Id: string, player2Id: string,}) {
    
    this.gameService.startGameLoop(this.getGameId(userIds.player1Id, userIds.player2Id));

    this.server.to(this.inGameUsersById[userIds.player2Id]).emit('startGame');
  }

  @SubscribeMessage('endGame')
  endGame(client: Socket, userIds :{ player1Id: string, player2Id: string,}) {
    
    this.gameService.endGame(this.getGameId(userIds.player1Id, userIds.player2Id));

    this.server.to(this.inGameUsersById[userIds.player2Id]).emit('endGame');

    if (this.inGameUsersById[userIds.player1Id]) 
      delete this.inGameUsersById[userIds.player1Id];
    if (this.inGameUsersById[userIds.player2Id]) 
      delete this.inGameUsersById[userIds.player2Id];

  }


  @SubscribeMessage('paddleMove')
  paddleMove(client: Socket, data :{userIds :{ player1Id: string, player2Id: string,}, paddle: {y :number} }) {

    const game = this.gameService.games[this.getGameId(data.userIds.player1Id, data.userIds.player2Id)]

    game.paddles[client.id].y = data.paddle.y;

    this.server.to(this.inGameUsersById[data.userIds.player2Id]).emit('paddleMove', data.paddle);
  }

  getGameId(player1: string, player2: string) {

    if (player1 > player2)
      return (`${player1}${player2}`);
    else 
      return (`${player2}${player1}`);
  }


  
}
