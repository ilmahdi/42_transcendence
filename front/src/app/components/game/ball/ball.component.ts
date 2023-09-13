import { Component, Input, OnInit } from '@angular/core';
import { BoardComponent } from '../board/board.component';
import { PaddleComponent } from '../paddle/paddle.component';

@Component({
  selector: 'app-ball',
  template: '',
  styleUrls: []
})
export class BallComponent implements OnInit{

  constructor(
  ) {
  }

  private x = 0; 
  private y = 0;
  private velocityX = 3;
  private velocityY = 3;
  private r = 14;
  private color = '#ED5252';
  
  private isBallSkiped : boolean = false;


  @Input() ctx!: CanvasRenderingContext2D;
  @Input() gameBoard!: BoardComponent;
  @Input() canvas!: HTMLCanvasElement;
  @Input() player1Paddle!: PaddleComponent;
  @Input() player2Paddle!: PaddleComponent;


  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.initBallPosition()
    this.adapteBallSize()
  }

  public drawBall() {
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    this.ctx.closePath()
    this.ctx.fill();

  }
  public updatePosition() {
    this.x += this.velocityX;
    this.y += this.velocityY;
    
    if (this.y + this.r > this.canvas.height || this.y - this.r < 0)
      this.velocityY = - this.velocityY
    if (this.x - this.r > this.canvas.width || this.x + this.r < 0)
      this.initBallPosition()

    if (!this.isBallSkiped && this.checkBallToHit())
      this.checkBallPaddlesCollision()

  }

  private checkBallToHit() {

    const ballRight = this.x + this.r;
    const ballLeft = this.x - this.r;


    const paddleLeft = this.player1Paddle.x;
    const paddleRight = this.player2Paddle.x  + this.player2Paddle.width;

    if (
      ballRight >= paddleLeft || ballLeft <= paddleRight 
    ) {
      return true; 
    }
  
    return false;
  }


  private checkBallPaddlesCollision() {
    if (this.x > this.canvas.width / 2) {
      if (this.checkBallPaddleCollision(this.player1Paddle)) {

        this.velocityX = - this.velocityX;
        this.velocityY = - this.velocityY;
      }
      else
        this.isBallSkiped = true;
    } else {
      if (this.checkBallPaddleCollision(this.player2Paddle)) {

        this.velocityX = - this.velocityX
        this.velocityY = - this.velocityY
      }
      else
        this.isBallSkiped = true;
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
  

  private initBallPosition() {

    this.isBallSkiped = false;
    this.x = this.gameBoard.width / 2;
    this.y = this.gameBoard.height / 2;
  }

  private adapteBallSize() {
    this.r = this.gameBoard.width / 60;
  }
  

}
