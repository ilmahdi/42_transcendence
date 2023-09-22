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
  handleRequestOpponentId(client: Socket, userId :string) {
    
    if (!this.inGameUsersById[userId] || !this.connectionGateway.connectedUsersById[userId]) {

      this.inGameUsersById[userId] = client.id;
      this.addToQueue(userId);
    }
    else 
      this.server.to(client.id).emit('failRequestOpponentId');

  }
  @SubscribeMessage('inviteOpponentId')
  handleInviteOpponentId(client: Socket, userIds :{ player1Id: string, player2Id: string,}) {
    
    if (!this.inGameUsersById[userIds.player1Id] && !this.inGameUsersById[userIds.player2Id]) {
      
      const socketId = this.connectionGateway.connectedUsersById[userIds.player2Id];
      
      this.gameService.sendGameInviteNotif({
        from_id: +userIds.player1Id,
        to_id: +userIds.player2Id,
        type: "GAME_INVITE",
      })
      this.inGameUsersById[userIds.player1Id] = client.id;
      this.server.to(client.id).emit('waitInviteOpponentId', userIds.player2Id);
      this.server.to(socketId).emit('inviteOpponentId', { notify: 1 });
    }
    else 
      this.server.to(client.id).emit('failInviteOpponentId');

  }
  @SubscribeMessage('acceptGameInvite')
  handleAcceptGameInvite(client: Socket, userIds :{ player1Id: string, player2Id: string,}) {
    
    if (!this.inGameUsersById[userIds.player1Id]) {

      this.inGameUsersById[userIds.player1Id] = client.id;

      const socketId1 = client.id;
      const socketId2 = this.inGameUsersById[userIds.player2Id];


      
      this.gameService.createGame(this.server, this.getGameId(userIds.player1Id, userIds.player2Id), socketId2, socketId1);
      
      this.server.to(socketId2).emit('successGameInvite');
    }
  }
  @SubscribeMessage('cancelGameInvite')
  handleCancelGameInvite(client: Socket, userId :string) {


    const socketId1 = this.inGameUsersById[userId];
    if (socketId1) {

      if (socketId1 !== client.id)
        this.server.to(socketId1).emit('cancelGameInvite');

      this.gameService.deleteGameInviteNotif({
        from_id: +userId,
      })

      delete this.inGameUsersById[userId];
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
  handleStartGame(client: Socket, userIds :{ player1Id: string, player2Id: string,}) {
    
    this.gameService.startGameLoop(this.getGameId(userIds.player1Id, userIds.player2Id));

    this.server.to(this.inGameUsersById[userIds.player2Id]).emit('startGame');
  }

  @SubscribeMessage('endGame')
  handleEndGame(client: Socket, userIds :{ player1Id: string, player2Id: string,}) {
    
    this.gameService.endGame(this.getGameId(userIds.player1Id, userIds.player2Id));

    this.server.to(this.inGameUsersById[userIds.player1Id]).emit('endGame');
    this.server.to(this.inGameUsersById[userIds.player2Id]).emit('endGame');

    if (this.inGameUsersById[userIds.player1Id]) 
      delete this.inGameUsersById[userIds.player1Id];
    if (this.inGameUsersById[userIds.player2Id]) 
      delete this.inGameUsersById[userIds.player2Id];

  }
  

  @SubscribeMessage('paddleMove')
  handlePaddleMove(client: Socket, data :{userIds :{ player1Id: string, player2Id: string,}, paddle: {y :number} }) {
    
    const game = this.gameService.games[this.getGameId(data.userIds.player1Id, data.userIds.player2Id)]
    if (game) {
      game.paddles[client.id].y = data.paddle.y;

      this.server.to(this.inGameUsersById[data.userIds.player2Id]).emit('paddleMove', data.paddle);
    }
  }

  @SubscribeMessage('rematchGame')
  handleRematchGame(client: Socket, userIds :{ player1Id: string, player2Id: string,}) {

    this.server.to(this.inGameUsersById[userIds.player2Id]).emit('rematchGame');
  }

  getGameId(player1: string, player2: string) {

    if (player1 > player2)
      return (`${player1}${player2}`);
    else 
      return (`${player2}${player1}`);
  }


  
}
