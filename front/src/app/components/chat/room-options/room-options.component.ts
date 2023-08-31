import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Room } from 'src/app/models/room.model';
import { RoomType } from 'src/app/models/roomType.enum';
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
  form = new FormGroup({password:new FormControl});

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

  changeType(type:string) {
    // this.members = []
    if (type === 'public')
      this.room.type = RoomType.PUBLIC
    else if(type === 'protected')
      this.room.type = RoomType.PROTECTED
    else if(type === 'private')
      this.room.type = RoomType.PRIVATE
    // this.chatService.roomOptionsSource.next(this.room)
  }

  saveRoom() {
    if (this.form.value.password) {
      this.room.password = this.form.value.password;
      this.chatService.updateRoom(this.room).subscribe();
    }
    else if (this.room.type !== RoomType.PROTECTED) {
      const data = this.room
      this.chatService.updateRoom(data).subscribe();
    }
  }

  back() {
    this.chatService.displayComponents(false, true, false, true, true, false)
    this.chatService.roomOptions$.subscribe(data=>{
      this.room = data
    })
  }
}
