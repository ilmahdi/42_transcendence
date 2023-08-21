import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-direct',
  templateUrl: './direct.component.html',
  styleUrls: ['./direct.component.css']
})
export class DirectComponent implements OnInit {

  @Output() customEvent = new EventEmitter<string>();
  n:any[] = [
    {id:1, name:'oussama', message: 'lets play a game', readed: true, date: '03/02/2022'},
    {id:2, name:'ismail', message:'lets play a game', readed: false, date: '03/02/2022'},
    {id:3, name:'omar', message:'lets play a game', readed: true, date: '03/02/2022'}
  ];
  constructor() { }

  ngOnInit(): void {
  }

  emitEvent(name:string) {
    this.customEvent.emit(name)
  }

}
