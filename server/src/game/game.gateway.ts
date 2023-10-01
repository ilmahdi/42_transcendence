import { WebSocketGateway, SubscribeMessage, WebSocketServer } from '@nestjs/websockets';
import { GameService } from './game.service';
import { ConnectionGateway } from 'src/common/gateways/connection.gateway';
import { Server, Socket } from 'socket.io';
import { error } from 'console';

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



  private waitingPlayers: string[] = [];


  @SubscribeMessage('broadcastPlaying')
  broadcastPlaying(client: Socket, userId: string) {
    try {
      
      const userSocketIds = this.connectionGateway.userUserListeners[userId];
      
      if (userSocketIds) {
        userSocketIds.forEach((socketId) => {
          
          this.server.to(socketId).emit('playing', userId);
        });
      }
    } catch (error) {
      this.server.to(client.id).emit('errorEvent', { message: "broadcastPlaying error" });

    }
  }
  
  @SubscribeMessage('requestOpponentId')
  handleRequestOpponentId(client: Socket, userId :string) {
    
    try {
      if (!this.connectionGateway.inGameUsersById[userId] || !this.connectionGateway.connectedUsersById[userId]) {

        this.connectionGateway.inGameUsersById[userId] = client.id;
        this.addToQueue(userId);
      }
      else 
        this.server.to(client.id).emit('failRequestOpponentId');
    } catch (error) {
      this.server.to(client.id).emit('errorEvent', { message: "requestOpponentId error" });
    }
  }
  @SubscribeMessage('inviteOpponentId')
  handleInviteOpponentId(client: Socket, userIds :{ player1Id: string, player2Id: string,}) {
    
    try {
      if (!this.connectionGateway.inGameUsersById[userIds.player1Id] && !this.connectionGateway.inGameUsersById[userIds.player2Id]) {
        
        const socketId = this.connectionGateway.connectedUsersById[userIds.player2Id];
        
        this.gameService.sendGameInviteNotif({
          from_id: +userIds.player1Id,
          to_id: +userIds.player2Id,
          type: "GAME_INVITE",
        })
        this.connectionGateway.inGameUsersById[userIds.player1Id] = client.id;
        this.server.to(client.id).emit('waitInviteOpponentId', userIds.player2Id);
        this.server.to(socketId).emit('notifyFriendRequest', { notify: 1 });
      }
      else 
        this.server.to(client.id).emit('failInviteOpponentId');
    } catch (error) {
      this.server.to(client.id).emit('errorEvent', { message: "inviteOpponentId error" });

    }
  }
  @SubscribeMessage('acceptGameInvite')
  handleAcceptGameInvite(client: Socket, userIds :{ player1Id: string, player2Id: string,}) {
    
    try {
      if (!this.connectionGateway.inGameUsersById[userIds.player1Id]
        && this.connectionGateway.inGameUsersById[userIds.player2Id]) {

        this.connectionGateway.inGameUsersById[userIds.player1Id] = client.id;

        const socketId1 = client.id;
        const socketId2 = this.connectionGateway.inGameUsersById[userIds.player2Id];


        
        this.gameService.createGame(this.server, this.getGameId(userIds.player1Id, userIds.player2Id), socketId2, socketId1);
        
        this.server.to(socketId1).emit('successGameInvite');
        this.server.to(socketId2).emit('successGameInvite');
      }
    } catch (error) {
      this.server.to(client.id).emit('errorEvent', { message: "acceptGameInvite error" });

    }
  }
  @SubscribeMessage('cancelGameInvite')
  handleCancelGameInvite(client: Socket, userIds :{ player1Id: string, player2Id: string}) {

    try {
      const socketId1 = this.connectionGateway.inGameUsersById[userIds.player1Id];
      const socketId2 = this.connectionGateway.connectedUsersById[userIds.player2Id];

      if (socketId1) {

        if (socketId1 !== client.id) {

          this.server.to(socketId1).emit('cancelGameInvite'); 

        }
        else
          this.server.to(socketId2).emit('unNotifyFriendRequest', { notify: -1 });


        this.gameService.deleteGameInviteNotif({
          from_id: +userIds.player1Id,
        })

        delete this.connectionGateway.inGameUsersById[userIds.player1Id];
      }
    } catch (error) {
      this.server.to(client.id).emit('errorEvent', { message: "cancelGameInvite error" });

    }
  }
  @SubscribeMessage('leaveMatchmaking')
  handleLeaveMatchmaking(client: Socket, userId :string) {

    try {
      if (this.connectionGateway.inGameUsersById[userId]) {

        delete this.connectionGateway.inGameUsersById[userId];
        this.connectionGateway.broadcastOnline(client, userId)
        this.waitingPlayers = this.waitingPlayers.filter(item => item != userId);
      }
    } catch (error) {
      this.server.to(client.id).emit('errorEvent', { message: "leaveMatchmaking error" });

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
    const socketId1 = this.connectionGateway.inGameUsersById[player2];
    const socketId2 = this.connectionGateway.inGameUsersById[player1];

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
    
    try {
      this.gameService.startGameLoop(this.getGameId(userIds.player1Id, userIds.player2Id));

      this.server.to(this.connectionGateway.inGameUsersById[userIds.player2Id]).emit('startGame');
    } catch (error) {
      this.server.to(client.id).emit('errorEvent', { message: "startGame error" });

    }
  }

  @SubscribeMessage('endGame')
  handleEndGame(client: Socket, userIds :{ player1Id: string, player2Id: string,}) {
    
    try {
      this.gameService.endGame(this.getGameId(userIds.player1Id, userIds.player2Id));

      this.server.to(this.connectionGateway.inGameUsersById[userIds.player1Id]).emit('endGame');
      this.server.to(this.connectionGateway.inGameUsersById[userIds.player2Id]).emit('endGame');

      if (this.connectionGateway.inGameUsersById[userIds.player1Id]) {

        delete this.connectionGateway.inGameUsersById[userIds.player1Id];
        this.connectionGateway.broadcastOnline(client, userIds.player1Id)
      }
      if (this.connectionGateway.inGameUsersById[userIds.player2Id]) {

        delete this.connectionGateway.inGameUsersById[userIds.player2Id];
        this.connectionGateway.broadcastOnline(client, userIds.player2Id)
      }
    } catch (error) {
      this.server.to(client.id).emit('errorEvent', { message: "endGame error" });

    }

  }
  

  @SubscribeMessage('paddleMove')
  handlePaddleMove(client: Socket, data :{userIds :{ player1Id: string, player2Id: string,}, paddle: {y :number} }) {
    
    try {
      const game = this.gameService.games[this.getGameId(data.userIds.player1Id, data.userIds.player2Id)]
      if (game) {
        game.paddles[client.id].y = data.paddle.y;

        this.server.to(this.connectionGateway.inGameUsersById[data.userIds.player2Id]).emit('paddleMove', data.paddle);
      }
    } catch (error) {
      this.server.to(client.id).emit('errorEvent', { message: "paddleMove error" });

    }
  }

  @SubscribeMessage('rematchGame')
  handleRematchGame(client: Socket, userIds :{ player1Id: string, player2Id: string,}) {

    try {
      this.server.to(this.connectionGateway.inGameUsersById[userIds.player2Id]).emit('rematchGame');
    } catch (error) {
      this.server.to(client.id).emit('errorEvent', { message: "rematchGame error" });
    }
  }

  getGameId(player1: string, player2: string) {

    if (player1 > player2)
      return (`${player1}${player2}`);
    else 
      return (`${player2}${player1}`);
  }

  @SubscribeMessage('storeGame')
  handleStoreGame(client: Socket, userIds :{ player1Id: string, player2Id: string }) {
    try {
      const game = this.gameService.games[this.getGameId(userIds.player1Id, userIds.player2Id)]
      if (game) {
        if (!game.isGameStored) {
          game.isGameStored = true;

          let score1 :number;
          let score2 :number;

          if (game.isGameEnded) {

            score1 = game.paddles[this.connectionGateway.inGameUsersById[userIds.player1Id]].score;
            score2 = game.paddles[this.connectionGateway.inGameUsersById[userIds.player2Id]].score;
          }
          else {
            score1 = 0;
            score2 = 3;
          }

          this.gameService.storeGame({ 
            player1: {
              id: userIds.player1Id,
              score: score1,
            }, 
            player2: {
              id: userIds.player2Id,
              score: score2,
            },
            start_time: game.start_time,
          }).catch(() => {
            this.server.to(client.id).emit('errorEvent', { message: 'Error while storing game result.' });

          });
        }
      }
    } catch (error) {
      this.server.to(client.id).emit('errorEvent', { message: 'Error while storing game result.' });
    }

  }

  
}
