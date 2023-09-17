import { Injectable } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@Injectable()
export class GameService {

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

} 

class GameInstance {

  constructor(private server: Server) {
    
  }

  private gameLoopInterval: NodeJS.Timeout | null = null;
  private tickRate = 1000 / 60; // 60 FPS

  public board :Board = new Board();
  public ball :Ball = new Ball();
  public player1 :string;
  public player2 :string;
  public paddles: { [userId: string]: Paddle } = {}; 

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

    this.ball.velocityY = 0;
    this.ball.velocityX = this.ball.speed * 0.6;
    this.ball.r = this.board.width / 60;
    this.ball.x = this.board.width / 2;
    this.ball.y = this.board.height / 2;
    
  }

  startGameLoop() {
    if (!this.gameLoopInterval) {
      this.gameLoopInterval = setInterval(() => {

        this.updatePosition();
        this.server.emit('gameStateUpdate', this.ball);

      }, this.tickRate);
    }
  }

  stopGameLoop() {
    if (this.gameLoopInterval) {
      clearInterval(this.gameLoopInterval);
      this.gameLoopInterval = null;
    }
  }

  updatePosition() {
    if (this.ball.isBallIn) {

      this.ball.x += this.ball.velocityX;
      this.ball.y += this.ball.velocityY;
    }
    
    if (this.ball.y + this.ball.r > this.board.height || this.ball.y - this.ball.r < 0)
      this.ball.velocityY = - this.ball.velocityY
    else if (this.ball.x - this.ball.r > this.board.width || this.ball.x + this.ball.r < 0) {

      this.ball.isBallIn = false;
      this.initBallPosition()
      this.getInitialVelocity();
    }

    else if (!this.ball.isBallSkiped && this.checkBallToHit())
      this.checkBallPaddlesCollision()

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
      }
      else {

        this.ball.isBallSkiped = true;
        ++this.paddles[this.player2].score;

      }
    } else {
      if (this.checkBallPaddleCollision(this.paddles[this.player2])) {

        this.calculateVelocity(this.paddles[this.player2]);
      }
      else {

        this.ball.isBallSkiped = true;
        ++this.paddles[this.player1].score;

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

    setTimeout(() => {
      this.ball.isBallSkiped = false;
      this.ball.isBallIn = true;
    }, 200); 

    this.ball.x = this.board.width / 2;
    this.ball.y = this.board.height / 2;

  }
  getInitialVelocity() {
    
    this.ball.velocityX = this.ball.speed * 0.6;
    this.ball.velocityY = 0;

    // if (this.gameService.isToStart)
    //   this.velocityX *= -1;
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