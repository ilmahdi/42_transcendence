import { Component, OnInit } from '@angular/core';
import { Message } from 'src/app/models/message.model';
import { User } from 'src/app/models/user.model';
import { ChatService } from 'src/app/services/chat.service';
import { LoginComponent } from '../login/login.component';
import { LoginService } from 'src/app/services/login.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  userEvent?:any[]
  conversationEvent!:Message[];

  directClicked: boolean = true
  roomsClicked: boolean = false
  screenWidth: number = 1000;
  smallScreen:boolean = false;
  displayConvers:boolean = false;

  lastMessage:Message[] = []
  userId?:number
  constructor(private chatService:ChatService, private loginService:LoginService) {
    this.screenWidth = window.innerWidth;
    window.addEventListener('resize', this.onResize.bind(this));

    this.loginService.userId.pipe(take(1)).subscribe((id?:any) => {
      this.userId = id;
    })
    chatService.sendToGetLastMessage(this.userId!)
  }

  ngOnInit(): void {
    // this.chatService.getLastMessage().subscribe(data=>this.lastMessage?.push(data))
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
