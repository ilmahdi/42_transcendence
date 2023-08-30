import { Component, OnInit } from '@angular/core';
import { Room } from 'src/app/models/room.model';
import { User } from 'src/app/models/user.model';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-room-options',
  templateUrl: './room-options.component.html',
  styleUrls: ['./room-options.component.css']
})
export class RoomOptionsComponent implements OnInit{
  room:Room = {}
  members:User[] = []

  constructor(private chatService:ChatService) {
    chatService.roomOptions$.subscribe(data=>{
      this.room = data

      this.chatService.getRoomMembers(this.room).subscribe(users=> {
        users.forEach(user=>this.members.push(user))
      })
    })
  }

  ngOnInit(): void {
  }
}
