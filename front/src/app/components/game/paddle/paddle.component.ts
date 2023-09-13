import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { BoardComponent } from '../board/board.component';

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
  private color = '#DEC8C8';
  private cornerRadius = 4;
  private paddleMargin = 2;
  private keysPressed: { [key: string]: boolean } = {};

  @Input() ctx!: CanvasRenderingContext2D;
  @Input() gameBoard!: BoardComponent;
  @Input() isOwnPaddle: boolean = false;
  @Input() canvas!: HTMLCanvasElement;

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.adaptePaddleSize();
    this.adaptePaddleSide();
  }
  
  public drawPaddle() {

    this.ctx.save();

    this.ctx.fillStyle = this.color;

    this.ctx.beginPath();
    this.ctx.moveTo(this.x + this.cornerRadius, this.y);
    this.ctx.lineTo(this.x + this.width - this.cornerRadius, this.y);
    this.ctx.arcTo(this.x + this.width, this.y, this.x + this.width, this.y + this.cornerRadius, this.cornerRadius);
    this.ctx.lineTo(this.x + this.width, this.y + this.height - this.cornerRadius);
    this.ctx.arcTo(this.x + this.width, this.y + this.height, this.x + this.width - this.cornerRadius, this.y + this.height, this.cornerRadius);
    this.ctx.lineTo(this.x + this.cornerRadius, this.y + this.height);
    this.ctx.arcTo(this.x, this.y + this.height, this.x, this.y + this.height - this.cornerRadius, this.cornerRadius);
    this.ctx.lineTo(this.x, this.y + this.cornerRadius);
    this.ctx.arcTo(this.x, this.y, this.x + this.cornerRadius, this.y, this.cornerRadius);
    this.ctx.closePath();

    this.ctx.fill();

    this.ctx.restore();

  }

  private adaptePaddleSize() {
    this.width = this.gameBoard.width / 80;
    this.height = this.gameBoard.height / 6;
  }
  private adaptePaddleSide() {
    if (this.isOwnPaddle) {
      this.x = this.gameBoard.width - this.x - this.width;
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

    if (this.y + this.height > this.canvas.height) {
      this.y = this.canvas.height - this.height - this.paddleMargin;
    }
  }


  public onKeyDown(event: KeyboardEvent): void {
    this.keysPressed[event.key] = true;
  }

  public onKeyUp(event: KeyboardEvent): void {
    this.keysPressed[event.key] = false;
  }

}
