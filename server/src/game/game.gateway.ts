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
  
  @SubscribeMessage('inviteOpponentId')
  inviteOpponentId(client: Socket, userId :string) {
    
    
    this.server.to(this.inGameUsersById[userId]).emit('inviteOpponentId');
  }
  @SubscribeMessage('requestOpponentId')
  requestOpponentId(client: Socket, userId :string) {
    
    if (!this.inGameUsersById[userId]) {

      this.inGameUsersById[userId] = client.id;
      this.addToQueue(userId);
    }
  }
  @SubscribeMessage('leaveMatchmaking')
  handleLeaveMatchmaking(client: Socket, userId :string) {

    if (this.inGameUsersById[userId]) {

      delete this.inGameUsersById[userId];
      this.waitingPlayers = this.waitingPlayers.filter(item => item != userId);
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
    const socketId1 = this.inGameUsersById[player2];
    const socketId2 = this.inGameUsersById[player1];

    this.gameService.createGame(this.server, this.getGameId(player1, player2), socketId1, socketId2);

    this.server.to(socketId1).emit('opponentId', { 
      userId: player1,
      isToStart: false,
    });

    this.server.to(socketId2).emit('opponentId', { 
      userId: player2,
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

    this.server.to(this.inGameUsersById[userIds.player1Id]).emit('endGame');
    this.server.to(this.inGameUsersById[userIds.player2Id]).emit('endGame');

    if (this.inGameUsersById[userIds.player1Id]) 
      delete this.inGameUsersById[userIds.player1Id];
    if (this.inGameUsersById[userIds.player2Id]) 
      delete this.inGameUsersById[userIds.player2Id];

  }
  

  @SubscribeMessage('paddleMove')
  paddleMove(client: Socket, data :{userIds :{ player1Id: string, player2Id: string,}, paddle: {y :number} }) {
    
    const game = this.gameService.games[this.getGameId(data.userIds.player1Id, data.userIds.player2Id)]
    if (game) {
      game.paddles[client.id].y = data.paddle.y;

      this.server.to(this.inGameUsersById[data.userIds.player2Id]).emit('paddleMove', data.paddle);
    }
  }

  @SubscribeMessage('rematchGame')
  rematchGame(client: Socket, userIds :{ player1Id: string, player2Id: string,}) {

    this.server.to(this.inGameUsersById[userIds.player2Id]).emit('rematchGame');
  }

  getGameId(player1: string, player2: string) {

    if (player1 > player2)
      return (`${player1}${player2}`);
    else 
      return (`${player2}${player1}`);
  }


  
}
