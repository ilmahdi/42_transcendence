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
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements AfterViewInit {

  constructor(
    public gameService : GameService,
    private authService :AuthService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private userService: UserService,
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
  public gameLevel :string = "EASY"
  private gameStage :string = "START";
  private animationFrameId!: number;
  private currentTime! :number;

  private subscriptions: Subscription[] = [];


  @ViewChild('ball') ball!: BallComponent;
  @ViewChild('gameBoard') gameBoard!: BoardComponent;
  @ViewChild('player1Paddle') player1Paddle!: PaddleComponent;
  @ViewChild('player2Paddle') player2Paddle!: PaddleComponent;

  ngOnInit() {

    
    this.socket.emit("broadcastPlaying", this.gameService.playerId1);

    this.canvas = this.elementRef.nativeElement.querySelector('canvas#gameCanvas');
    this.ctx = this.canvas.getContext('2d')!;
    
    this.getUserData(this.gameService.playerId1);
    if (!this.gameService.isOnePlayer) {

      this.getUserData(this.gameService.playerId2);
      this.onSkGameStateUpdate();
      this.onSkGameScoreUpdate();
      this.onSkStartGame();
      this.onSkEndGame();
      this.onSkRematchGamee();
    }

  }

  ngAfterViewInit(): void {
    if (!this.gameService.isOnePlayer)
      this.player2Paddle.updateOpponentPaddle();

    this.setCanvas();

    this.setGameByPlayer()

    this.canvas.addEventListener('click', this.handleCanvasPlayClick.bind(this));
    this.canvas.addEventListener('click', this.handleCanvasLevelClick.bind(this));
    this.canvas.addEventListener('click', this.handleCanvasRematchClick.bind(this));
    this.canvas.addEventListener('click', this.handleCanvasAcceptClick.bind(this));

    this.canvas.addEventListener('mousemove', (event) => this.player1Paddle.onMouseMove(event));
    window.addEventListener('keydown', (event) => this.player1Paddle.onKeyDown(event));
    window.addEventListener('keyup', (event) => this.player1Paddle.onKeyUp(event));

  }
  private setGameByPlayer() {

    if (this.gameService.isToStart) {


      this.gameBoard.setCanvasBackgroundColor();
      this.playButtons()
    }
    else {
      this.displayFrame();
       
    }
  }

  // fetch data
  /******************************************************************************************** */

  private getUserData(userId: number) {
    if (userId){

      const subscription = this.userService.getUserDataShort2(userId).subscribe({
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
    this.subscriptions.push(subscription);
    }

  }


  // host listeners
  /******************************************************************************************** */
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

  // canvas listeners
  /******************************************************************************************** */
  private handleCanvasPlayClick(event: MouseEvent) {
    if (this.gameStage === "START" && this.gameService.isToStart && !this.gameService.isOnePlayer) {

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
        this.currentTime = new Date().getTime();

        this.emitStartGame();
        this.renderNormal();
      }
    }
  }
  private handleCanvasLevelClick(event: MouseEvent) {
    if (this.gameStage === "START" && this.gameService.isOnePlayer) {

      let isClick = false;
      const canvasRect = this.canvas.getBoundingClientRect();
    
      const clickX = event.clientX - canvasRect.left;
      const clickY = event.clientY - canvasRect.top;
      
      if (this.checkClickPosition(event, this.canvas.width / 2, this.canvas.height / 3)) {
        this.gameLevel = "EASY"
        this.player2Paddle.level = 0.08;
        isClick =  true;
      }
      else if (this.checkClickPosition(event, this.canvas.width / 2, this.canvas.height / 2)) {
        this.gameLevel = "MEDIUM"
        this.player2Paddle.level = 0.12;
        isClick =  true;
      }
      else if (this.checkClickPosition(event, this.canvas.width / 2, 2 * this.canvas.height / 3)) {
        this.gameLevel = "HARD"
        this.player2Paddle.level = 0.26;
        isClick =  true;
      }
      
      if (isClick) {
        this.gameStage = "PLAY";
        this.currentTime = new Date().getTime();
        this.renderOne();
      }
    }
  }
  private handleCanvasRematchClick(event: MouseEvent) {
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
        if (this.gameService.isOnePlayer) {
          this.player1Paddle.score = 0;
          this.player2Paddle.score = 0;
          this.gameStage = "START";
          this.ball.initBallPosition()
          this.ball.getInitialVelocity()
          this.currentTime = new Date().getTime();
          this.gameBoard.setCanvasBackgroundColor();
          this.playButtons()
        }
        else
          this.emitRematchGame();
      }
    }
  }
  
  private handleCanvasAcceptClick(event: MouseEvent) {
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
        this.renderNormal();
      }
    }
  }






  // game loop
  /******************************************************************************************** */

  private renderNormal(): void {
    const cDeltaTime = (new Date().getTime() - this.currentTime) / 17;
    this.currentTime = new Date().getTime();

    this.ball.updatePosition2(cDeltaTime);
    
    this.displayFrame();
    
    cancelAnimationFrame(this.animationFrameId);
    if (this.gameStage === "END") {

      this.ball.initBallPosition()
      this.ball.getInitialVelocity()
      this.ball.isBallIn = false;
      this.displayEndGameMsgs();
    }
    else 
      this.animationFrameId =  requestAnimationFrame(() => this.renderNormal());
  }
  private renderOne(): void {
    const cDeltaTime = (new Date().getTime() - this.currentTime) / 17;
    this.currentTime = new Date().getTime();

    this.player2Paddle.updateBoot(cDeltaTime)
    this.ball.updatePosition(cDeltaTime)
    
    this.displayFrame();
    
    cancelAnimationFrame(this.animationFrameId);
    if (this.player1Paddle.score === 3 || this.player2Paddle.score === 3)  {

      this.gameStage = "END";
      this.ball.isBallSkiped = false;
      this.displayEndGameMsgs();
    }
    else 
      this.animationFrameId =  requestAnimationFrame(() => this.renderOne());
  }
  private displayFrame() {


    this.gameBoard.setCanvasBackgroundColor();
    this.gameBoard.drawDashedLine();
    this.ball.drawBall()
    this.player1Paddle.dispalyScore()
    this.player2Paddle.dispalyScore()
    this.player1Paddle.drawPaddle();
    this.player2Paddle.drawPaddle();

  }


  // game utlis
  /******************************************************************************************** */
  private setCanvas () {

    const canvasWidth = this.gameBoard.width; 
    const canvasHeight = this.gameBoard.height; 


    this.renderer.setAttribute(this.canvas, 'width', canvasWidth.toString());
    this.renderer.setAttribute(this.canvas, 'height', canvasHeight.toString());

    this.resizeCanvas();
    
  }
  private displayEndGameMsgs() {

    this.gameBoard.setCanvasBackgroundColor();
    if (this.player1Paddle.score === 3) {
        
      this.player1Paddle.displayEndGameMessage("You Won")
    }
    else if (this.player2Paddle.score === 3){
      
      this.player2Paddle.displayEndGameMessage("You Lost")
    }
    this.gameBoard.drawPlayButton("REMATCH", this.gameBoard.height / 2, 140, 50);
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
          this.gameBoard.setCanvasBackgroundColor();
          this.playButtons()
        }
        else {
          this.ball.initBallPosition()
          this.displayFrame()
        }
      }
      else if (this.gameStage === "END")
        this.displayEndGameMsgs();
      else if (this.gameStage === "ACCEPT") {

        this.gameBoard.setCanvasBackgroundColor();
        this.player1Paddle.displayEndGameMessage("Rematch request")
        this.gameBoard.drawPlayButton("Accept", this.gameBoard.height / 2, 140, 50);
      }
    }
  }
  private playButtons() {

    if (this.gameService.isOnePlayer) {

      this.gameBoard.drawPlayButton("EASY", this.gameBoard.height / 3, 140, 50);
      this.gameBoard.drawPlayButton("MEDIUM", this.gameBoard.height / 2, 140, 50);
      this.gameBoard.drawPlayButton("HARD",  2 * this.gameBoard.height / 3, 140, 50);
    }
    else
      this.gameBoard.drawPlayButton("Play", this.gameBoard.height / 2, 140, 50);
  }

  private checkClickPosition(event: MouseEvent, positionX :number, positionY :number) {

    const canvasRect = this.canvas.getBoundingClientRect();
  
    const clickX = event.clientX - canvasRect.left;
    const clickY = event.clientY - canvasRect.top;

    return (clickX >= positionX - 70 &&
    clickX <= positionX + 70 &&
    clickY >= positionY - 25 &&
    clickY <= positionY + 25)
  }

  // socket emit 
  /*******************************************************************************/
  private emitStartGame() {

    this.socket.emit("startGame", {
      player1Id: this.gameService.playerId1,
      player2Id: this.gameService.playerId2,
    });
  }
  private emitEndGame() {

    this.socket.emit("endGame", {
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
  private emitStoreGame() {

    this.socket.emit("storeGame", {
      player1Id: this.gameService.playerId1,
      player2Id: this.gameService.playerId2,
    });
  }
  

  // socket on 
  /*******************************************************************************/
  private onSkGameStateUpdate() {
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
  
  private onSkGameScoreUpdate() {
    this.socket.on('gameScoreUpdate', (isToStart :boolean) => {

      if (isToStart)
        ++this.player2Paddle.score;
      else
        ++this.player1Paddle.score
      if (this.player1Paddle.score === 3 || this.player2Paddle.score === 3) {

        if (this.gameStage !== "END" && this.gameService.isToStart)
          this.emitStoreGame();
        this.gameStage = "END";
      }
    });
 
  }
  private onSkStartGame() {
    
    this.socket.on('startGame', () => {

    this.gameStage = "PLAY";
    this.player1Paddle.score = 0;
    this.player2Paddle.score = 0;
    this.currentTime = new Date().getTime();

    this.renderNormal();
  });

  }
  private onSkEndGame() {
    
    this.socket.on('endGame', () => {

      cancelAnimationFrame(this.animationFrameId);
      this.gameService.setInGameMode(false);
      this.router.navigate(['/home']);
    });

  }
  private onSkRematchGamee() {

    this.socket.on('rematchGame', () => {

      this.gameBoard.setCanvasBackgroundColor();
      this.player1Paddle.displayEndGameMessage("Rematch request")
      this.gameBoard.drawPlayButton("Accept", this.gameBoard.height / 2, 140, 50);

      this.gameStage = "ACCEPT";
      
    });

  }

  ngOnDestroy(): void {

    this.socket.emit("broadcastOnline", this.gameService.playerId1);
    cancelAnimationFrame(this.animationFrameId);
    this.gameService.setInGameMode(false);
    this.emitEndGame()

    this.socket.off('gameStateUpdate');
    this.socket.off('gameScoreUpdate');
    this.socket.off('startGame');
    this.socket.off('endGame');
    this.socket.off('rematchGame');

    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  
}