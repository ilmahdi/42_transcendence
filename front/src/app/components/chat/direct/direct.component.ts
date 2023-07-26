import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-direct',
  templateUrl: './direct.component.html',
  styleUrls: ['./direct.component.css']
})
export class DirectComponent implements OnInit {

  @Output() customEvent = new EventEmitter<string>();
  n:any[] = [
    {id:1, name:'saad', message: 'lets play a game', readed: true, date: '03/02/2022'},
    {id:2, name:'ismail', message:'lets play a game', readed: false, date: '03/02/2022'},
    {id:3, name:'omar', message:'lets play a game', readed: true, date: '03/02/2022'}
  ];
  screenWidth: number = 1000;
  smallScreen:boolean = false;

  constructor() {
    this.screenWidth = window.innerWidth;
    window.addEventListener('resize', this.onResize.bind(this));
  }

  ngOnInit(): void {
  }

  onResize() {
    this.screenWidth = window.innerWidth;
  }

  emitEvent(name:string) {
    this.customEvent.emit(name)
  }

}
