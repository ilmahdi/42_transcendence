import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { take } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { ChatService } from '../../../services/chat.service';
import { Room } from 'src/app/models/room.model';
import { Message } from 'src/app/models/message.model';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {

  @Output() conversData = new EventEmitter<Room>()
  smallScreen:boolean = false;
  
  userId?:number;

  rooms:Room[] = []
  messages:Message[] = []
  constructor(private loginService:LoginService, private chatService:ChatService) {
    this.loginService.userId.pipe(take(1)).subscribe((id?:any) => {
      this.userId = id;
    })
  }

  ngOnInit(): void {
    this.chatService.sendToGetRooms(this.userId!);
    this.chatService.getRooms().subscribe(data=>{
      data.forEach(item=> {
        this.rooms.push(item)
      })
    })
  }

  openRoom(room:Room) {
    this.chatService.sendToGetRoomConversation(room)
    this.chatService.getRoomConversation().
    subscribe((data) => {
      this.messages.splice(0, this.messages.length);
      data.forEach((item)=>{
          this.messages.push(item)
      })
    })
    this.chatService.updateRoomConversation(this.messages);

    this.chatService.roomFormular(false)
    this.conversData.emit(room);
  }
}
