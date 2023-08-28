import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { take } from 'rxjs';
import { Room } from 'src/app/models/room.model';
import { RoomType } from 'src/app/models/roomType.enum';
import { ChatService } from 'src/app/services/chat.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-other-rooms',
  templateUrl: './other-rooms.component.html',
  styleUrls: ['./other-rooms.component.css']
})
export class OtherRoomsComponent implements OnInit{
  password = new FormGroup({password: new FormControl})
  allRooms:Room[] = []
  protectSelect:boolean = false;
  userId?:number
  roomWaitForPassword?:Room
  displayList:boolean = false

  constructor(private chatService:ChatService, private loginService:LoginService) {
    this.loginService.userId.pipe(take(1)).subscribe((id?:any) => {
      this.userId = id;
    })

    chatService.displayOtherRooms$.subscribe(data=> this.displayList = data)
  }

  ngOnInit(): void {
    this.chatService.sendTetOtherRooms()
    this.chatService.getOtherRooms().subscribe(data=>{
      this.allRooms = []
      data.forEach(room=>{
        if (!room.usersId?.includes(this.userId!))
          this.allRooms.push(room)
      })
    })
  }

  updateRoomsConversations() {
    this.chatService.sendToGetRooms(this.userId!);
    this.chatService.getRooms().subscribe(data=> this.chatService.updateRooms(data))
  }

  onJoinPublic(room:Room) {
    if (room.type === RoomType.PUBLIC) {
      this.protectSelect = false
      this.chatService.joinRoom(this.userId!, room).subscribe(data=> {
        // REMOVE ROOM JOINED FROM THE OTHER ROOMS LIST AND ADD IT TO THE ROOMS CONVERSATIONS LIST
        this.chatService.sendTetOtherRooms()
        this.chatService.getOtherRooms().subscribe(data=>{
          this.allRooms = []
          data.forEach(room=>{
            if (!room.usersId?.includes(this.userId!))
              this.allRooms.push(room)
          })
          this.updateRoomsConversations()
        })
      })
    }
    else if(room.type === RoomType.PROTECTED) {
      this.protectSelect = true
      this.roomWaitForPassword = room;
    }
  }

  onJoinProtected() {
    if (this.password.value.password) {
      this.chatService.joinProtected(this.userId!, this.roomWaitForPassword!, this.password.value.password).subscribe(data=>{
        // REMOVE ROOM JOINED FROM THE OTHER ROOMS LIST AND ADD IT TO THE ROOMS CONVERSATIONS LIST
        this.chatService.sendTetOtherRooms()
        this.chatService.getOtherRooms().subscribe(data=>{
          this.allRooms = []
          data.forEach(room=>{
            if (!room.usersId?.includes(this.userId!))
              this.allRooms.push(room)
          })
          this.updateRoomsConversations()
        })
      })
      this.protectSelect = false;
    }
  }
}
