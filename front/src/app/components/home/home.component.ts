import { Component, OnInit } from '@angular/core';
import { ChatSocketService } from '../chat/core/chat-socket.service';
import { ChatService } from 'src/app/services/chat.service';
import { LoginService } from 'src/app/services/login.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  userId?:number
  constructor(private loginService:LoginService, private chatService:ChatService) {
    // this.socket.connect()
    // chatServise.setSocket(this.socket)
    this.loginService.userId.pipe(take(1)).subscribe((id?:any) => {
      this.userId = id
    })
    this.chatService
  }

  ngOnInit(): void {
  }

}
