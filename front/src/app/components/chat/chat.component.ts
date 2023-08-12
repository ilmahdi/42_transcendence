import { Component, OnInit } from '@angular/core';
import { Message } from 'src/app/models/message.model';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  userEvent?:any[]
  conversationEvent!:Message[];
  lastMessage!:Message

  directClicked: boolean = true
  roomsClicked: boolean = false
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

  onCustomEvent(user:User) {
    this.smallScreen = true
    this.userEvent = [user, true]
    this.displayConvers = false
  }

  getConversation(data:Message[]) {
    this.conversationEvent = data;
  }

}
