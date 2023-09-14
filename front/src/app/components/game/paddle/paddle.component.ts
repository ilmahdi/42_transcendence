import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { BoardComponent } from '../board/board.component';
import { BallComponent } from '../ball/ball.component';
import { initial } from 'lodash';

@Component({
  selector: 'app-paddle',
  template: '',
  styleUrls: [],
})
export class PaddleComponent implements OnInit{

  constructor(
  ) {
  }

  public x = 10; 
  public y = 2;
  public width = 0;
  public height = 0;
  public score: number = 0;
  private color = '#DEC8C8';
  private paddleMargin = 2;
  private keysPressed: { [key: string]: boolean } = {};
  private level :number = 0.2;
  private initialX :number = 10;

  @Input() ctx!: CanvasRenderingContext2D;
  @Input() gameBoard!: BoardComponent;
  @Input() ball!: BallComponent;
  @Input() isOwnPaddle: boolean = false;
  @Input() canvas!: HTMLCanvasElement;

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.adaptePaddleSize();
    this.adaptePaddleSide();
  }
  
  public drawPaddle() {

    this.ctx.fillStyle = this.color;

    this.ctx.fillRect(this.x, this.y, this.width, this.height);

  }

  public adaptePaddleSize() {
    this.width = this.gameBoard.width / 80;
    this.height = this.gameBoard.height / 6;
  }
  public adaptePaddleSide() {
    if (this.isOwnPaddle) {
      this.x = this.gameBoard.width - this.initialX - this.width;
    }
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
  }
  public updateOnKeyDown(): void {

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
  }


  public onKeyDown(event: KeyboardEvent): void {
    this.keysPressed[event.key] = true;
  }

  public onKeyUp(event: KeyboardEvent): void {
    this.keysPressed[event.key] = false;
  }



  public updateAI() {
    
    const paddleCenter = this.y + this.height / 2;
    const targetY = this.ball.y ;
    
    
    const deltaY = targetY - paddleCenter;
    if (this.ball.velocityX < 0) {
      this.y += deltaY * this.level / 2;
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

}
