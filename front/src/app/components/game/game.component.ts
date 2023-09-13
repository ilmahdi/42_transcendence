import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PaddleComponent } from './paddle/paddle.component';
import { BoardComponent } from './board/board.component';
import { BallComponent } from './ball/ball.component';

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

  @ViewChild('ball') ball!: BallComponent;
  @ViewChild('gameBoard') gameBoard!: BoardComponent;
  @ViewChild('player1Paddle') player1Paddle!: PaddleComponent;
  @ViewChild('player2Paddle') player2Paddle!: PaddleComponent;

  ngOnInit() {

    this.canvas = this.elementRef.nativeElement.querySelector('canvas#gameCanvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  ngAfterViewInit(): void {


    this.render();
    this.canvas.addEventListener('mousemove', (event) => this.player1Paddle.onMouseMove(event));
    window.addEventListener('keydown', (event) => this.player1Paddle.onKeyDown(event));
    window.addEventListener('keyup', (event) => this.player1Paddle.onKeyUp(event));

  }











  private render(): void {
   
    this.setCanvasBackgroundColor(this.gameBoard.color);
    this.player1Paddle.updateOnKeyDown();
    this.player1Paddle.drawPaddle();
    this.player2Paddle.drawPaddle();
    this.gameBoard.drawDashedLine();
    this.ball.updatePosition()
    this.ball.drawBall()

    requestAnimationFrame(() => this.render());
  }

  

  private setCanvasBackgroundColor(color: string): void {
    const canvasWidth = this.gameBoard.width; 
    const canvasHeight = this.gameBoard.height; 


    this.renderer.setAttribute(this.canvas, 'width', canvasWidth.toString());
    this.renderer.setAttribute(this.canvas, 'height', canvasHeight.toString());



    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }


  

  
}