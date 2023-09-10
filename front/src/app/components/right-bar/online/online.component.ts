import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-online',
  templateUrl: './online.component.html',
  styleUrls: ['./online.component.css']
})
export class OnlineComponent implements OnInit {

  users:any[] = [{name: 'oussama'},
      {name: 'omar'},
      {name: 'anas'},
      {name: 'mohammed'},
      {name: 'ali'},
      {name: 'saad'}
    ]
  constructor() { }

  ngOnInit(): void {
  }

}
