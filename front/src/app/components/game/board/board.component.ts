import { AfterViewInit, Component, Input } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-board',
  template: '',
  styleUrls: []
})
export class BoardComponent implements AfterViewInit {

  constructor(
    private gameService : GameService,
  ) {
    this.adapteCanvasSize();
    this.adaptMap();
  }

  public width: number = 680;
  public height: number = 480;
  public initialWidth: number = 680;
  public initialHeight: number = 480;
  public color: string = '#000';
  public objColor: string = '#DEC8C8'


  @Input() ctx!: CanvasRenderingContext2D;

  ngAfterViewInit(): void {

  }


   drawDashedLine() {
    this.ctx.save();
    
    this.ctx.setLineDash([5, 5]);
    
    this.ctx.strokeStyle = this.objColor; 
    this.ctx.lineWidth = 2; 
    
    this.ctx.beginPath();
    this.ctx.moveTo(this.width / 2, 0);
    this.ctx.lineTo(this.width / 2, this.height);
    this.ctx.stroke();

    this.ctx.restore();
  }

  public drawPlayButton(msg :string) {
    
    this.ctx.strokeStyle = this.objColor;
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(this.width / 2 - 70, this.height / 2 - 25, 140, 50);
  
    this.ctx.fillStyle = this.objColor;
    this.ctx.font = '24px Arial';


    const textWidth = this.ctx.measureText(msg).width;
    const textHeight = this.ctx.measureText(msg).actualBoundingBoxAscent ;


    this.ctx.fillText(msg, this.width / 2 - (textWidth/2), this.height / 2 + (textHeight / 2)); 
  }

  public adapteCanvasSize() :boolean {

    const innerWidth = window.innerWidth - 16;

    if (innerWidth < this.initialWidth) {
      this.width = innerWidth;
      return true;
    }
    else if (this.initialWidth > this.width && 
      innerWidth > this.initialWidth) {
      this.width = this.initialWidth;
      return true;
    }
    return false;
  }

  public adaptMap() {

    this.color = this.gameService.maps[this.gameService.mapIndex].boardColor;
    this.objColor = this.gameService.maps[this.gameService.mapIndex].objColor;

  }

  

 


}
