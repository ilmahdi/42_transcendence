import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  directClicked: boolean = true
  roomsClicked: boolean = false
  nameEvent?:any[]
  screenWidth: number = 1000;
  smallScreen:boolean = false;
  displayConvers:boolean = false;

  constructor() {
    this.screenWidth = window.innerWidth;
    window.addEventListener('resize', this.onResize.bind(this));
  }

  ngOnInit(): void {
  }

  onResize() {
    this.screenWidth = window.innerWidth;
  }

  onDirect() {
    this.directClicked = true;
    this.roomsClicked = false;
  }

  onRooms() {
    this.roomsClicked = true;
    this.directClicked = false;
  }

  conversEvent(convers:boolean) {
    this.displayConvers = convers
  }

  onCustomEvent(name:string) {
    this.smallScreen = true
    this.nameEvent = [name, true]
    this.displayConvers = false
  }

}
