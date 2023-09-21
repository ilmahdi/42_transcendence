import { AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PaddleComponent } from './paddle/paddle.component';
import { BoardComponent } from './board/board.component';
import { BallComponent } from './ball/ball.component';
import { IUserDataShort } from 'src/app/utils/interfaces/user-data.interface';
import { UserService } from 'src/app/services/user.service';
import { GameService } from 'src/app/services/game.service';
import { CustomSocket } from 'src/app/utils/socket/socket.module';
import { Router } from '@angular/router';

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
    private router: Router,
  ) {

    this.authService.setAuthenticated(false);
  }

  public canvas!: HTMLCanvasElement;
  public ctx!: CanvasRenderingContext2D;
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
  private gameStage :string = "START";
  private animationFrameId!: number;
  private currentTime! :number;


  @ViewChild('ball') ball!: BallComponent;
  @ViewChild('gameBoard') gameBoard!: BoardComponent;
  @ViewChild('player1Paddle') player1Paddle!: PaddleComponent;
  @ViewChild('player2Paddle') player2Paddle!: PaddleComponent;

  ngOnInit() {

    this.getUserData(this.gameService.playerId1);
    this.getUserData(this.gameService.playerId2);

    this.canvas = this.elementRef.nativeElement.querySelector('canvas#gameCanvas');
    this.ctx = this.canvas.getContext('2d')!;

    this.gameStateUpdate();
    this.gameScoreUpdate();

    this.socket.on('startGame', () => {

      this.gameStage = "PLAY";
      this.player1Paddle.score = 0;
      this.player2Paddle.score = 0;

      this.currentTime = new Date().getTime();
      this.render();
    });

    this.socket.on('endGame', () => {

      cancelAnimationFrame(this.animationFrameId);
      this.gameService.setInGameMode(false);
      this.router.navigate(['/home']);
    });

    this.socket.on('rematchGame', () => {

      this.setCanvasBackgroundColor();
      this.player1Paddle.displayEndGameMessage("Rematch request")
      this.gameBoard.drawPlayButton("Accept");

      this.gameStage = "ACCEPT";
      
    });

  }

  ngAfterViewInit(): void {

    this.player2Paddle.updateOpponentPaddle();
    this.setCanvas();
    if (this.gameService.isToStart) {

      this.setCanvasBackgroundColor();
      this.gameBoard.drawPlayButton("Play")
    }
    else {
      this.displayFrame();
       
    }

    this.canvas.addEventListener('click', this.handleCanvasPlayClick.bind(this));
    this.canvas.addEventListener('click', this.handleCanvasRematchClick.bind(this));
    this.canvas.addEventListener('click', this.handleCanvasAcceptClick.bind(this));

    this.canvas.addEventListener('mousemove', (event) => this.player1Paddle.onMouseMove(event));
    window.addEventListener('keydown', (event) => this.player1Paddle.onKeyDown(event));
    window.addEventListener('keyup', (event) => this.player1Paddle.onKeyUp(event));

  }
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {

    this.gameService.setInGameMode(false);
    this.router.navigate(['/home']);
  }

  @HostListener('window:resize')
  onResize() {
    this.resizeCanvas();
  }
  onLeaveClick() {
    cancelAnimationFrame(this.animationFrameId);
    this.gameService.setInGameMode(false);
    this.router.navigate(['/home']);
  }

  handleCanvasPlayClick(event: MouseEvent) {
    if (this.gameStage === "START" && this.gameService.isToStart) {

      const canvasRect = this.canvas.getBoundingClientRect();
    
      const clickX = event.clientX - canvasRect.left;
      const clickY = event.clientY - canvasRect.top;
    
      if (
        clickX >= this.canvas.width / 2 - 70 &&
        clickX <= this.canvas.width / 2 + 70 &&
        clickY >= this.canvas.height / 2 - 25 &&
        clickY <= this.canvas.height / 2 + 25
      ) {
        this.gameStage = "PLAY";
        this.emitStartGame();
        this.currentTime = new Date().getTime();
        this.render();
      }
    }
  }
  handleCanvasRematchClick(event: MouseEvent) {
    if (this.gameStage == "END") {

      const canvasRect = this.canvas.getBoundingClientRect();
    
      const clickX = event.clientX - canvasRect.left;
      const clickY = event.clientY - canvasRect.top;
    
      if (
        clickX >= this.canvas.width / 2 - 70 &&
        clickX <= this.canvas.width / 2 + 70 &&
        clickY >= this.canvas.height / 2 - 25 &&
        clickY <= this.canvas.height / 2 + 25
      ) {
        this.emitRematchGame();
      }
    }
  }
  
  handleCanvasAcceptClick(event: MouseEvent) {
    if (this.gameStage === "ACCEPT") {

      const canvasRect = this.canvas.getBoundingClientRect();
    
      const clickX = event.clientX - canvasRect.left;
      const clickY = event.clientY - canvasRect.top;
    
      if (
        clickX >= this.canvas.width / 2 - 70 &&
        clickX <= this.canvas.width / 2 + 70 &&
        clickY >= this.canvas.height / 2 - 25 &&
        clickY <= this.canvas.height / 2 + 25
      ) {
        this.player1Paddle.score = 0;
        this.player2Paddle.score = 0;
        this.gameStage = "PLAY";
        this.emitStartGame();
        this.render();
      }
    }
  }







  private render(): void {
    const cDeltaTime = (new Date().getTime() - this.currentTime) / 17;
    this.currentTime = new Date().getTime();

    this.ball.updatePosition2(cDeltaTime);
    
    this.displayFrame();
    
    cancelAnimationFrame(this.animationFrameId);
    if (this.gameStage === "END") 
      this.displayEndGameMsgs();
    else 
      this.animationFrameId =  requestAnimationFrame(() => this.render());
  }


  private resizeCanvas() {

    if (this.gameBoard.adapteCanvasSize()) {

      this.renderer.setAttribute(this.canvas, 'width', this.gameBoard.width.toString());
      this.player1Paddle.initPaddlePosition();
      this.player2Paddle.initPaddlePosition();
      this.ball.adapteBallSize();

      if (this.gameStage === "START") {
        if (this.gameService.isToStart) {

          this.ball.initBallPosition();
          this.setCanvasBackgroundColor();
          this.gameBoard.drawPlayButton("Play");
        }
        else {
          this.ball.initBallPosition()
          this.displayFrame()
        }
      }
      else if (this.gameStage === "END")
        this.displayEndGameMsgs();
      else if (this.gameStage === "ACCEPT") {

        this.setCanvasBackgroundColor();
        this.player1Paddle.displayEndGameMessage("Rematch request")
        this.gameBoard.drawPlayButton("Accept");
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
  private displayEndGameMsgs() {

    this.setCanvasBackgroundColor();
    if (this.player1Paddle.score === 3) {
        
      this.player1Paddle.displayEndGameMessage("You Won")
    }
    else if (this.player2Paddle.score === 3){
      
      this.player2Paddle.displayEndGameMessage("You Lost")
    }
    this.gameBoard.drawPlayButton("REMATCH");
  }

  private emitStartGame() {

    this.socket.emit("startGame", {
      player1Id: this.gameService.playerId1,
      player2Id: this.gameService.playerId2,
    });
  }
  private emitRematchGame() {

    this.socket.emit("rematchGame", {
      player1Id: this.gameService.playerId1,
      player2Id: this.gameService.playerId2,
    });
  }
  
  private gameStateUpdate() {
    this.socket.on('gameStateUpdate', (ball :any) => {

      this.ball.y = ball.y;
      this.ball.velocityY = ball.velocityY;

      if (this.gameService.isToStart) {
        this.ball.x = this.gameBoard.width - (ball.x * (this.gameBoard.width / this.gameBoard.initialWidth))
        this.ball.velocityX = - ball.velocityX * (this.gameBoard.width / this.gameBoard.initialWidth);
      }
      else {
        
        this.ball.x = ball.x * (this.gameBoard.width / this.gameBoard.initialWidth);
        this.ball.velocityX = ball.velocityX * (this.gameBoard.width / this.gameBoard.initialWidth);
      }

    });
 
  }
  
  private gameScoreUpdate() {
    this.socket.on('gameScoreUpdate', (isToStart :boolean) => {

      if (isToStart)
        ++this.player2Paddle.score;
      else
        ++this.player1Paddle.score
      if (this.player1Paddle.score === 3 || this.player2Paddle.score === 3)
        this.gameStage = "END";
    });
 
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationFrameId);
    this.gameService.setInGameMode(false);
    this.socket.emit("endGame", {
      player1Id: this.gameService.playerId1,
      player2Id: this.gameService.playerId2,
    });
  }
  

  
}