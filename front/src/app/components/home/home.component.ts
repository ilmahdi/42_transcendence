import { Component, OnInit } from '@angular/core';
import { ChatSocketService } from '../chat/core/chat-socket.service';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(/* private chatServise:ChatService, private socket:ChatSocketService, */ private chatService:ChatService) {
    // this.socket.connect()
    // chatServise.setSocket(this.socket)
    this.chatService
  }

  ngOnInit(): void {
  }

}
