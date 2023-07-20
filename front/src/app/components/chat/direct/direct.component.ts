import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-direct',
  templateUrl: './direct.component.html',
  styleUrls: ['./direct.component.css']
})
export class DirectComponent implements OnInit {

  n:any[] = [
    {name:'oussama', message: 'lets play a game', readed: true, date: '03/02/2022'},
    {name:'ismail', message:'lets play a game', readed: false, date: '03/02/2022'},
    {name:'omar', message:'lets play a game', readed: true, date: '03/02/2022'}
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
