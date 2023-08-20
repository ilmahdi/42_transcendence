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
  screenWidth: number = 1000;
  
  userId?:number;

  rooms:Room[] = []
  messages:Message[] = []
  color:any = {color:'', name:''}

  constructor(private loginService:LoginService, private chatService:ChatService) {
    this.loginService.userId.pipe(take(1)).subscribe((id?:any) => {
      this.userId = id;
    })

    this.screenWidth = window.innerWidth;
    window.addEventListener('resize', this.onResize.bind(this));
  }

  ngOnInit(): void {
    this.chatService.sendToGetRooms(this.userId!);
    this.chatService.getRooms().subscribe(data=>{
      data.forEach(item=> {
        this.rooms.push(item)
      })
    })
  }

  onResize() {
    this.screenWidth = window.innerWidth;
  }

  openRoom(room:Room) {
    //  IF THE SCREEN WIDTH < 934 SO THE CONVERSATION BUTTON COLOR WILL NOT CHANGE WHEN THE USER CLICK IT
    if (this.screenWidth > 934) {
      this.color = {color:'#D38146', name:room.name}
    }
    else
      this.color = {color:'', name:''}

    //  GET THE CONVERSATION FROM SERVER
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
