import { AfterViewInit, Component, Input } from '@angular/core';

@Component({
  selector: 'app-board',
  template: '',
  styleUrls: []
})
export class BoardComponent implements AfterViewInit {

  constructor(
  ) {
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


 


}
