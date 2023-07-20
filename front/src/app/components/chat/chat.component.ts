import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  directClicked: boolean = true
  roomsClicked: boolean = false
  nameEvent?:string
  constructor() { }

  ngOnInit(): void {
  }

  onDirect() {
    this.directClicked = true;
    this.roomsClicked = false;
  }

  onRooms() {
    this.roomsClicked = true;
    this.directClicked = false;
  }

  onCustomEvent(name:string) {
    this.nameEvent = name;
  }

}
