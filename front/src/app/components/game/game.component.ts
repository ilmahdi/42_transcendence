import { AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PaddleComponent } from './paddle/paddle.component';
import { BoardComponent } from './board/board.component';
import { BallComponent } from './ball/ball.component';
import { IPlayer } from 'src/app/utils/interfaces/history.interface';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements AfterViewInit {

  constructor(
    private authService :AuthService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
  ) {

    this.authService.setAuthenticated(false)
  }

  public canvas!: HTMLCanvasElement;
  public ctx!: CanvasRenderingContext2D;
  public player1: IPlayer = {
    username : "ilmahd",
    avatar : "",
    rating: 1254,
    score: 10,
    points: 0,
  };
  public player2: IPlayer = {
    username : "ilmahd",
    avatar : "",
    rating: 1254,
    score: 10,
    points: 0,
  };

  @ViewChild('ball') ball!: BallComponent;
  @ViewChild('gameBoard') gameBoard!: BoardComponent;
  @ViewChild('player1Paddle') player1Paddle!: PaddleComponent;
  @ViewChild('player2Paddle') player2Paddle!: PaddleComponent;

  ngOnInit() {

    this.canvas = this.elementRef.nativeElement.querySelector('canvas#gameCanvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  ngAfterViewInit(): void {


    this.setCanvas();
    this.render();
    this.canvas.addEventListener('mousemove', (event) => this.player1Paddle.onMouseMove(event));
    window.addEventListener('keydown', (event) => this.player1Paddle.onKeyDown(event));
    window.addEventListener('keyup', (event) => this.player1Paddle.onKeyUp(event));

  }

  @HostListener('window:resize')
  onResize() {
    this.resizeCanvas();
  }











  private render(): void {
   
    this.player1Paddle.updateOnKeyDown();
    this.player2Paddle.updateAI();
    this.ball.updatePosition()

    this.setCanvasBackgroundColor();
    this.gameBoard.drawDashedLine();
    this.ball.drawBall()
    this.player1Paddle.dispalyScore()
    this.player2Paddle.dispalyScore()
    this.player1Paddle.drawPaddle();
    this.player2Paddle.drawPaddle();

    requestAnimationFrame(() => this.render());
  }


  private resizeCanvas() {
    const innerWidth = window.innerWidth - 16;

    if (innerWidth < this.gameBoard.initialWidth) {
      this.gameBoard.width = innerWidth;
    }
    else if (this.gameBoard.initialWidth > this.gameBoard.width && 
      innerWidth > this.gameBoard.initialWidth) {
      this.gameBoard.width = this.gameBoard.initialWidth;
    }
    else 
      return
    this.renderer.setAttribute(this.canvas, 'width', this.gameBoard.width.toString());
    this.player1Paddle.adaptePaddleSize();
    this.player1Paddle.adaptePaddleSide();
    this.player2Paddle.adaptePaddleSize();
    this.ball.adapteBallSize();
    this.ball.initSpeed();
    
  }
  

  private setCanvasBackgroundColor(): void {

    this.ctx.fillStyle = this.gameBoard.color;
    this.ctx.fillRect(0, 0, this.gameBoard.width, this.gameBoard.height);
  }
  private setCanvas () {

    const canvasWidth = this.gameBoard.width; 
    const canvasHeight = this.gameBoard.height; 


    this.renderer.setAttribute(this.canvas, 'width', canvasWidth.toString());
    this.renderer.setAttribute(this.canvas, 'height', canvasHeight.toString());

    this.resizeCanvas();
    
  }


  

  
}