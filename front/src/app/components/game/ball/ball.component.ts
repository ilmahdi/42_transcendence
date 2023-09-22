import { Component, Input, OnInit } from '@angular/core';
import { BoardComponent } from '../board/board.component';
import { PaddleComponent } from '../paddle/paddle.component';
import { GameService } from 'src/app/services/game.service';
import { CustomSocket } from 'src/app/utils/socket/socket.module';

@Component({
  selector: 'app-ball',
  template: '',
  styleUrls: []
})
export class BallComponent implements OnInit{

  constructor(
    private gameService : GameService,
    private socket: CustomSocket,
  ) {
    this.adaptMap();
  }

  public x = 0; 
  public y = 0;
  public velocityX = 1;
  public velocityY = 1;
  private speed = 10;
  private r = 14;
  private color = '#ED5252';
  
  private isBallSkiped : boolean = false;
  private isBallIn : boolean = true;


  @Input() ctx!: CanvasRenderingContext2D;
  @Input() gameBoard!: BoardComponent;
  @Input() canvas!: HTMLCanvasElement;
  @Input() player1Paddle!: PaddleComponent;
  @Input() player2Paddle!: PaddleComponent;


  ngOnInit(): void {

    this.socket.on('initBallPosition', () => {

      this.isBallSkiped = false;
      this.isBallIn = true;
    });

  }

  ngAfterViewInit(): void {
    this.initBallPosition();
    this.adapteBallSize();
    this.getInitialVelocity();
  }
  public drawBall() {
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    this.ctx.closePath()
    this.ctx.fill();

  }
  public updatePosition(cDeltaTime :number) {
    if (this.isBallIn) {

      this.x += this.velocityX * cDeltaTime;
      this.y += this.velocityY * cDeltaTime;
    }

    if (this.y + this.r > this.canvas.height)
      this.velocityY = -Math.abs(this.velocityY);
    else if (this.y - this.r < 0)
      this.velocityY = Math.abs(this.velocityY);

    if (this.x - this.r > this.canvas.width || this.x + this.r < 0) {

      this.isBallIn = false;
      this.initBallPosition()
      this.getInitialVelocity();
    }

    else if (!this.isBallSkiped && this.checkBallToHit())
      this.checkBallPaddlesCollision()

  }
  public updatePosition2(cDeltaTime :number) {
    if (this.isBallIn) {

      this.x += this.velocityX * cDeltaTime;
      this.y += this.velocityY * cDeltaTime;
      if (this.y + this.r > this.canvas.height) {
        this.velocityY = -Math.abs(this.velocityY);
      }
      else if (this.y - this.r < 0) {
        this.velocityY = Math.abs(this.velocityY);
      }
    }
    
    if (this.x - this.r > this.canvas.width || this.x + this.r < 0) {

      this.isBallIn = false;
      this.x = this.gameBoard.width / 2;
      this.y = this.gameBoard.height / 2;
      this.getInitialVelocity();
      
    }

  }

  private checkBallToHit() {

    const ballRight = this.x + this.r;
    const ballLeft = this.x - this.r;


    const paddleLeft = this.player1Paddle.x;
    const paddleRight = this.player2Paddle.x  + this.player2Paddle.width;

    if (ballRight >= paddleLeft || ballLeft <= paddleRight) {
      return true; 
    }
  
    return false;
  }


  private checkBallPaddlesCollision() {
    if (this.x > this.canvas.width / 2) {
      if (this.checkBallPaddleCollision(this.player1Paddle)) {

        this.calculateVelocity(this.player1Paddle, -1);
        setTimeout(() => {
          this.isBallSkiped = false;
        }, 200); 
      }
      else {

        this.isBallSkiped = true;
        ++this.player2Paddle.score;

      }
    } else {
      if (this.checkBallPaddleCollision(this.player2Paddle)) {

        this.calculateVelocity(this.player2Paddle);
        setTimeout(() => {
          this.isBallSkiped = false;
        }, 200); 
      }
      else {

        this.isBallSkiped = true;
        ++this.player1Paddle.score;

      }
    }
  }
  private checkBallPaddleCollision(playerPaddle :PaddleComponent): boolean {


    const ballTop = this.y - this.r;
    const ballBottom = this.y + this.r;
  
    const paddleTop = playerPaddle.y;
    const paddleBottom = paddleTop + playerPaddle.height;
  
    if (
      ballBottom >= paddleTop &&
      ballTop <= paddleBottom
    ) {
      return true; 
    }
  

    return false;
  }
  private calculateVelocity(playerPaddle :PaddleComponent, direction :number = 1) {


    const paddleCenterY = playerPaddle.y + playerPaddle.height / 2;
    const relativeCollisionPoint = (this.y - paddleCenterY) / (playerPaddle.height / 2);
    const bounceAngle = relativeCollisionPoint * (Math.PI / 4);

    this.velocityX = direction * Math.cos(bounceAngle) * this.speed;
    this.velocityY = Math.sin(bounceAngle) * this.speed;
  
    
  }
  

  public initBallPosition() {

    setTimeout(() => {
      this.isBallSkiped = false;
      this.isBallIn = true;
    }, 200); 

    this.x = this.gameBoard.width / 2;
    this.y = this.gameBoard.height / 2;

  }

  public getInitialVelocity() {
    
    this.velocityX = this.speed * 0.6 * (this.gameBoard.width / this.gameBoard.initialWidth);
    this.velocityY = 0;

    if (this.gameService.isToStart)
      this.velocityX *= -1;
  }

  public adapteBallSize() {
    this.r = this.gameBoard.width / 60;
  }

  public adaptMap() {
    
    this.color = this.gameService.maps[this.gameService.mapIndex].ballColor;
  }



}
