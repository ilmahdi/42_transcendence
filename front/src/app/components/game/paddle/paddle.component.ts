import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { BoardComponent } from '../board/board.component';
import { BallComponent } from '../ball/ball.component';
import { GameService } from 'src/app/services/game.service';
import { CustomSocket } from 'src/app/utils/socket/socket.module';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-paddle',
  template: '',
  styleUrls: [],
})
export class PaddleComponent implements OnInit{

  constructor(
    private gameService : GameService,
    private socket: CustomSocket,
  ) {
    this.adaptMap();
  }

  public x = 10; 
  public y = 2;
  public width = 0;
  public height = 0;
  public score: number = 0;
  private color = '#DEC8C8';
  private paddleMargin = 2;
  private keysPressed: { [key: string]: boolean } = {};
  public level :number = 0;
  public initialX :number = 10;
  private keyLoop :any | null = null;

  @Input() ctx!: CanvasRenderingContext2D;
  @Input() gameBoard!: BoardComponent;
  @Input() ball!: BallComponent;
  @Input() isOwnPaddle: boolean = false;
  @Input() canvas!: HTMLCanvasElement;

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.initPaddlePosition();

    this.y = (this.gameBoard.height / 2) - (this.height / 2);
  }
  
  public drawPaddle() {
    this.ctx.fillStyle = this.color;

    this.ctx.fillRect(this.x, this.y, this.width, this.height);

  }


  public initPaddlePosition() {
    this.width = this.gameBoard.width / 80;
    this.height = this.gameBoard.height / 6;

    this.initialX = 10 *  this.gameBoard.width / this.gameBoard.initialWidth;

    if (this.isOwnPaddle) {
      this.x = this.gameBoard.width - this.initialX - this.width;
    }
    else
      this.x = this.initialX;
  }

  public onMouseMove(event: MouseEvent): void {

    const canvasRect = this.canvas.getBoundingClientRect();
    this.y = event.clientY - canvasRect.top - this.height / 2;

    if (this.y < 0) {
      this.y = this.paddleMargin;
    }

    if (this.y + this.height > this.canvas.height) {
      this.y = this.canvas.height - this.height - this.paddleMargin;
    }

    this.emitPaddleMove();
  }
  public updateOnKeyDown(): void {

    
    this.keyLoop = setInterval(() => {

      if (this.keysPressed['ArrowUp']) {
        this.y -= 10;
      }
      if (this.keysPressed['ArrowDown']) {
        this.y += 10;
      }

      if (this.y < 0) {
        this.y = this.paddleMargin;
      }
      else if (this.y + this.height > this.canvas.height) {
        this.y = this.canvas.height - this.height - this.paddleMargin;
      }
      if (!this.gameService.isOnePlayer)
        this.emitPaddleMove();
    }, 17);
  }

  public updateOpponentPaddle() {
    this.socket.on('paddleMove', (paddle :{y :number}) => {
      this.y = paddle.y;
    });
  }


  public onKeyDown(event: KeyboardEvent): void {
    this.keysPressed[event.key] = true;
    if (!this.keyLoop)
      this.updateOnKeyDown()
}

  public onKeyUp(event: KeyboardEvent): void {
  if (this.keyLoop) {
    clearInterval(this.keyLoop);
    this.keyLoop = null;
  }
  this.keysPressed[event.key] = false;
  }



  public updateBoot(cDeltaTime :number) {
    
    const paddleCenter = this.y + this.height / 2;
    const targetY = this.ball.y ;
    
    
    const deltaY = (targetY - paddleCenter) * cDeltaTime;
    if (this.ball.velocityX < 0 && this.x > this.gameBoard.width / 2
      || this.ball.velocityX > 0 && this.x < this.gameBoard.width / 2
    ) {
      this.y += deltaY * this.level / 3;
    }
    else {
      this.y += deltaY * this.level;
    }
      
    if (this.y < 0) {
      this.y = this.paddleMargin;
    }
    else if (this.y + this.height > this.canvas.height) {
      this.y = this.canvas.height - this.height - this.paddleMargin;
    }
  }
  public dispalyScore() {
    
    this.ctx.font = '2.6rem Arial';
    this.ctx.fillStyle = this.color;
    
    const textWidth = this.ctx.measureText(this.score.toString()).width;

    let posX;
    if (this.isOwnPaddle)
      posX = (this.gameBoard.width / 2) + 26;
    else
      posX = (this.gameBoard.width / 2) - 26 - textWidth;

    this.ctx.fillText(this.score.toString(), posX, this.gameBoard.height / 6);

  }
  public displayEndGameMessage(msg :string) {

    this.ctx.font = '2.6rem Arial';
    this.ctx.fillStyle = this.color;

    const textWidth = this.ctx.measureText(msg).width;


    this.ctx.fillText(msg, this.gameBoard.width / 2 - (textWidth/2), this.gameBoard.height / 3); 
  }
  public adaptMap() {

    this.color = this.gameService.maps[this.gameService.mapIndex].paddleColor;
  }
  
  
  private emitPaddleMove() {
    
    this.socket.emit("paddleMove", {
      userIds: {
        player1Id: this.gameService.playerId1,
        player2Id: this.gameService.playerId2,
      }, 
      paddle: {
        y: this.y 
      } 
    });
  }
  
  ngOnDestroy(): void {

    this.socket.removeAllListeners('paddleMove');

  }
}
