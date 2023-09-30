import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Server } from 'socket.io';
import { NotificationCreateDto } from 'src/user/notify/utils/dtos/create-notification.dto';
import { UserService } from 'src/user/user.service';
import { IHistory, IPlayer } from './utils/interfaces/history.interface';
import { NotifyService } from 'src/user/notify/notify.service';

@Injectable()
export class GameService {

  constructor(
    public notifyService :NotifyService,
    public userService :UserService,
    private prismaService: PrismaService,
  ) {

  }

  public games: { [gameId: string]: GameInstance } = {}; 

  createGame(server: Server, gameId: string, player1 :string, player2 :string) {

    const newGame = new GameInstance(server);

    newGame.initPaddles(player1, false);
    newGame.initPaddles(player2, true);
    newGame.initBall();
    newGame.player1 = player1;
    newGame.player2 = player2;

    this.games[gameId] = newGame; 
  }

  startGameLoop(gameId: string) {
    const game = this.games[gameId];
    if (game) {
      game.startGameLoop(); 
    }
  }

  endGame(gameId: string) {
    const game = this.games[gameId];
    if (game) {
      game.stopGameLoop(); 
      delete this.games[gameId];
    }
  }

  sendGameInviteNotif(notification: NotificationCreateDto) {
    
    this.notifyService.addNotification(notification);
  }
  deleteGameInviteNotif(notification: {from_id :number}) {
    
    this.notifyService.deleteGameInviteNotif(notification);
  }
  getWinStreak(winStreakHol :number, winStreak :number) {
    if (winStreakHol == 3 && winStreak < 3)
      return 3;
    if (winStreakHol == 7 && winStreak < 7)
      return 7;
    if (winStreakHol == 21 && winStreak < 21)
      return 21;
    return winStreak;

  }
  async storeGame(users: any) {

    // Fetch user data for player 1 and player 2
    const user1 = await this.userService.findUserById(+users.player1.id);
    const user2 = await this.userService.findUserById(+users.player2.id);
  
    // Calculate expected results
    const expectedResult = 1 / (1 + 10 ** ((user2.rating - user1.rating) / 400));

    
    // Calculate points earned by each player
    const point = Math.floor(19 * (+(users.player1.score > users.player2.score) - expectedResult));

    const win_streak_hol1 = users.player1.score > users.player2.score ? user1.win_streak_hol + 1 : 0;
    const win_streak_hol2 = users.player1.score < users.player2.score ? user2.win_streak_hol + 1 : 0;

    
    // Update user ratings
    await this.userService.updateUserAny(+users.player1.id, {
      rating: user1.rating + point,
      wins: user1.wins + +(users.player1.score > users.player2.score),
      losses: user1.losses + +(users.player1.score < users.player2.score),
      games: user1.games + 1,
      win_streak_hol: win_streak_hol1,
      win_streak : this.getWinStreak(win_streak_hol1, user1.win_streak),
    });
    await this.userService.updateUserAny(+users.player2.id, {
      rating: user2.rating - point,
      wins: user2.wins + +(users.player1.score < users.player2.score),
      losses: user2.losses + +(users.player1.score > users.player2.score),
      games: user2.games + 1,
      win_streak_hol: win_streak_hol2,
      win_streak : this.getWinStreak(win_streak_hol2, user2.win_streak),
    });

    // Create a new game entry
    await this.prismaService.matches.create({
      data: {
        id1: +users.player1.id,
        id2: +users.player2.id,
        score1: users.player1.score,
        score2: users.player2.score,
        rating1: user1.rating,
        rating2: user2.rating ,
        point1: point,
        point2: -point,
        start_time: users.start_time,
      },
    });
  }


  async getMatchHistory(userId :number) { 
    try {
      const matches = await this.prismaService.matches.findMany({
        where: {  OR: [
          {
            id1: userId,
          },
          {
            id2: userId,
          }
        ]},
        select: {
          score1: true,
          score2: true,
          rating1: true,
          rating2: true,
          point1: true,
          point2: true,
          start_time: true,
          end_time: true,
          player1: {
            select: {
              username: true,
              avatar: true,
            },
          },
          player2: {
            select: {
              username: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          start_time: 'desc',
        },
      });
  
      const formattedMatches: IHistory[] = matches.map((match) => {
        const player1: IPlayer = {
          username: match.player1.username,
          avatar: match.player1.avatar,
          rating: match.rating1,
          score: match.score1,
          points: match.point1,
        };
  
        const player2: IPlayer = {
          username: match.player2.username,
          avatar: match.player2.avatar,
          rating: match.rating2,
          score: match.score2,
          points: match.point2,
        };
  
        const start = new Date(match.start_time);
        const end = new Date(match.end_time);
        const diff = end.getTime() - start.getTime();
        const durationMinutes = Math.floor(diff / (1000 * 60)); 
        const durationSeconds = Math.floor((diff % (1000 * 60)) / 1000);
  
        const history: IHistory = {
          player1,
          player2,
          date: match.start_time,
          duration: {
            min: durationMinutes,
            sec: durationSeconds,
          },
        };
  
        return history;
      });
  
      return formattedMatches;

    } catch (error) {
      throw new HttpException('Error fetching matches: ' + error, HttpStatus.CONFLICT);
    } 
  }
} 













class GameInstance {

  constructor(private server: Server) {
    
  }

  private gameLoopInterval: NodeJS.Timeout | null = null;
  private tickRate = 17; // 60 FPS

  public board :Board = new Board();
  public ball :Ball = new Ball();
  public player1 :string;
  public player2 :string;
  public paddles: { [userId: string]: Paddle } = {}; 
  public isGameEnded :boolean = false;
  public isGameStored :boolean = false;
  private currentTime :number;
  public start_time :Date;

  initPaddles(userId :string, isRightPaddle :boolean) {

    this.paddles[userId] = new Paddle();

    this.paddles[userId].width = this.board.width / 80;
    this.paddles[userId].height = this.board.height / 6;
    
    if (!isRightPaddle)
      this.paddles[userId].x = this.board.width - this.paddles[userId].initialX - this.paddles[userId].width;
    else
      this.paddles[userId].x = this.paddles[userId].initialX;

    this.paddles[userId].y = (this.board.height / 2) - (this.paddles[userId].height / 2);
  }
  initBall () {

    this.getInitialVelocity();
    this.ball.r = this.board.width / 60;
    this.ball.x = this.board.width / 2;
    this.ball.y = this.board.height / 2;
    
  }

  startGameLoop() {
    this.isGameEnded = false;
    this.isGameStored = false;
    this.paddles[this.player1].score = 0;
    this.paddles[this.player2].score = 0;
    this.initBall();
    
    this.start_time = new Date();
    this.currentTime = new Date().getTime();

    if (!this.gameLoopInterval) {
      this.gameLoopInterval = setInterval(() => {

        
        const cDeltaTime = (new Date().getTime() - this.currentTime) / 17;
        this.currentTime = new Date().getTime();

        this.updatePosition(cDeltaTime);
        if (this.isGameEnded) {

          clearInterval(this.gameLoopInterval);
          this.gameLoopInterval = null;
          return;
        }
        
      }, this.tickRate);
    }
  }

  stopGameLoop() {
    if (this.gameLoopInterval) {
      clearInterval(this.gameLoopInterval);
      this.gameLoopInterval = null;
    }
  }

  updatePosition(cDeltaTime :number) {
    if (this.ball.isBallIn) {

      this.ball.x += this.ball.velocityX * cDeltaTime;
      this.ball.y += this.ball.velocityY * cDeltaTime;

      if (this.ball.y + this.ball.r > this.board.height) {
        this.ball.velocityY = -Math.abs(this.ball.velocityY);
      }
      else if (this.ball.y - this.ball.r < 0) {
        this.ball.velocityY = Math.abs(this.ball.velocityY);
      }
    }
    
    if (this.ball.x - this.ball.r > this.board.width || this.ball.x + this.ball.r < 0) {

      this.ball.isBallIn = false;
      this.initBallPosition()
      this.getInitialVelocity();
    }

    else if (!this.ball.isBallSkiped && this.checkBallToHit()) {

      this.ball.isBallSkiped = true;
      this.checkBallPaddlesCollision()
    }

  }
  checkBallToHit() {

    const ballRight = this.ball.x + this.ball.r;
    const ballLeft = this.ball.x - this.ball.r;


    const paddleLeft = this.paddles[this.player1].x;
    const paddleRight = this.paddles[this.player2].x  + this.paddles[this.player2].width;

    if (ballRight >= paddleLeft || ballLeft <= paddleRight) {
      return true; 
    }
  
    return false;
  }
  private checkBallPaddlesCollision() {
    if (this.ball.x > this.board.width / 2) {
      if (this.checkBallPaddleCollision(this.paddles[this.player1])) {

        this.calculateVelocity(this.paddles[this.player1], -1);
        setTimeout(() => {
          this.ball.isBallSkiped = false;
        }, 200); 
        this.server.to(this.player1).emit('gameStateUpdate', this.ball);
        this.server.to(this.player2).emit('gameStateUpdate', this.ball);
      }
      else {
        if (++this.paddles[this.player2].score === 3)
          this.isGameEnded = true;
        this.server.to(this.player1).emit('gameScoreUpdate', true);
        this.server.to(this.player2).emit('gameScoreUpdate', false);

      }
    } else {
      if (this.checkBallPaddleCollision(this.paddles[this.player2])) {

        this.calculateVelocity(this.paddles[this.player2]);
        setTimeout(() => {
          this.ball.isBallSkiped = false;
        }, 200); 
        this.server.to(this.player1).emit('gameStateUpdate', this.ball);
        this.server.to(this.player2).emit('gameStateUpdate', this.ball);
      }
      else {
        if (++this.paddles[this.player1].score === 3)
          this.isGameEnded = true;
        this.server.to(this.player1).emit('gameScoreUpdate', false);
        this.server.to(this.player2).emit('gameScoreUpdate', true);

      }
    }
  }
  private checkBallPaddleCollision(paddle :Paddle): boolean {

    const ballTop = this.ball.y - this.ball.r;
    const ballBottom = this.ball.y + this.ball.r;
  
    const paddleTop = paddle.y;
    const paddleBottom = paddleTop + paddle.height;
  
    if (
      ballBottom >= paddleTop &&
      ballTop <= paddleBottom
    ) {
      return true; 
    }
  
    return false;
  }
  private calculateVelocity(paddle :Paddle, direction :number = 1) {


    const paddleCenterY = paddle.y + paddle.height / 2;
    const relativeCollisionPoint = (this.ball.y - paddleCenterY) / (paddle.height / 2);
    const bounceAngle = relativeCollisionPoint * (Math.PI / 4);

    this.ball.velocityX = direction * Math.cos(bounceAngle) * this.ball.speed;
    this.ball.velocityY = Math.sin(bounceAngle) * this.ball.speed;

  }
  initBallPosition() {
    

    this.ball.x = this.board.width / 2;
    this.ball.y = this.board.height / 2;

    setTimeout(() => {
      this.server.to(this.player1).emit('initBallPosition');
      this.server.to(this.player2).emit('initBallPosition');

      this.ball.isBallSkiped = false;
      this.ball.isBallIn = true;
    }, 200); 

  }
  getInitialVelocity() {
    
    this.ball.velocityX = this.ball.speed * 0.6;
    this.ball.velocityY = 0;

  }

}


class Board {
  public width: number = 680;
  public height: number = 480;

}


class Ball {
  public x = 0; 
  public y = 0;
  public velocityX = 1;
  public velocityY = 1;
  public speed = 10;
  public r = 14;

  public isBallSkiped : boolean = false;
  public isBallIn : boolean = true;

}

class Paddle {
  public x = 10; 
  public y = 2;
  public width = 0;
  public height = 0;
  public score: number = 0;
  public paddleMargin = 2;
  public initialX :number = 10;

}