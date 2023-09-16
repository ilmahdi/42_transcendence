import { AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PaddleComponent } from './paddle/paddle.component';
import { BoardComponent } from './board/board.component';
import { BallComponent } from './ball/ball.component';
import { IUserDataShort } from 'src/app/utils/interfaces/user-data.interface';
import { UserService } from 'src/app/services/user.service';
import { GameService } from 'src/app/services/game.service';
import { CustomSocket } from 'src/app/utils/socket/socket.module';

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
    private userService: UserService,
    private gameService : GameService,
    private socket: CustomSocket,
  ) {

    this.authService.setAuthenticated(false);
    this.loggedInUserId  = this.authService.getLoggedInUserId();

  }

  public canvas!: HTMLCanvasElement;
  public ctx!: CanvasRenderingContext2D;
  public loggedInUserId :number;
  public player1: IUserDataShort = {
    username : "",
    avatar : "",
    rating: 0,
  };
  public player2: IUserDataShort = {
    username : "",
    avatar : "",
    rating: 0,
  };
  private isGameStarted :boolean = false;


  @ViewChild('ball') ball!: BallComponent;
  @ViewChild('gameBoard') gameBoard!: BoardComponent;
  @ViewChild('player1Paddle') player1Paddle!: PaddleComponent;
  @ViewChild('player2Paddle') player2Paddle!: PaddleComponent;

  ngOnInit() {

    this.getUserData(this.gameService.playerId1);
    this.getUserData(this.gameService.playerId2);

    this.canvas = this.elementRef.nativeElement.querySelector('canvas#gameCanvas');
    this.ctx = this.canvas.getContext('2d')!;

  }

  ngAfterViewInit(): void {

    this.setCanvas();
    if (this.gameService.isToStart) {

      this.setCanvasBackgroundColor();
      this.gameBoard.drawPlayButton()
    }
    else {
      this.displayFrame();
        this.socket.on('startGame', () => {
        this.render();
      });
    }

    this.canvas.addEventListener('click', this.handleCanvasClick.bind(this));

    this.canvas.addEventListener('mousemove', (event) => this.player1Paddle.onMouseMove(event));
    window.addEventListener('keydown', (event) => this.player1Paddle.onKeyDown(event));
    window.addEventListener('keyup', (event) => this.player1Paddle.onKeyUp(event));

  }

  @HostListener('window:resize')
  onResize() {
    this.resizeCanvas();
  }

  handleCanvasClick(event: MouseEvent) {
    const canvasRect = this.canvas.getBoundingClientRect();
  
    const clickX = event.clientX - canvasRect.left;
    const clickY = event.clientY - canvasRect.top;
  
    if (
      clickX >= this.canvas.width / 2 - 50 &&
      clickX <= this.canvas.width / 2 + 50 &&
      clickY >= this.canvas.height / 2 - 25 &&
      clickY <= this.canvas.height / 2 + 25
    ) {
      this.isGameStarted = true;
      this.render();
      this.emitStartGame();
    }
  }







  private render(): void {
   
    this.player1Paddle.updateOnKeyDown();
    this.emitPaddleMove();
    // this.player1Paddle.updateBoot();
    this.player2Paddle.updateOpponentPaddle();
    this.ball.updatePosition();

    this.displayFrame();

    requestAnimationFrame(() => this.render());
  }


  private resizeCanvas() {

    if (this.gameBoard.adapteCanvasSize()) {

      this.renderer.setAttribute(this.canvas, 'width', this.gameBoard.width.toString());
      this.player1Paddle.adaptePaddleSize();
      this.player1Paddle.adaptePaddleSide();
      this.player2Paddle.adaptePaddleSize();
      this.ball.adapteBallSize();
      this.ball.initSpeed();

      if (!this.isGameStarted) {
        
        this.ball.initBallPosition();
        this.setCanvasBackgroundColor();
        this.gameBoard.drawPlayButton();
      }
    }
    
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

  getUserData(userId: number) {
    if (userId){

      this.userService.getUserDataShort2(userId).subscribe({
        next: (response :IUserDataShort) => {

          if (userId === this.gameService.playerId1)
            this.player1 = response;
          else if (userId === this.gameService.playerId2)
            this.player2 = response;
      },
      error: error => {
        console.error('Error:', error.error.message); 
      }
    });
    }

  }

  private displayFrame() {

    this.setCanvasBackgroundColor();
    this.gameBoard.drawDashedLine();
    this.ball.drawBall()
    this.player1Paddle.dispalyScore()
    this.player2Paddle.dispalyScore()
    this.player1Paddle.drawPaddle();
    this.player2Paddle.drawPaddle();

  }

  private emitStartGame() {
    const opponentId = this.loggedInUserId === this.player1.id ? this.player2.id : this.player1.id;

    this.socket.emit("startGame", opponentId);
  }
  private emitPaddleMove() {
    const opponentId = this.loggedInUserId === this.player1.id ? this.player2.id : this.player1.id;

    this.socket.emit("paddleMove", {
      userId: opponentId, 
      paddle: {
        y: this.player1Paddle.y 
      } 
    });
  }

  ngOnDestroy(): void {
    
    this.socket.emit("endGame", this.loggedInUserId);
  }
  

  
}