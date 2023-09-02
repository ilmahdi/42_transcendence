import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription, take } from 'rxjs';
import { Room } from 'src/app/models/room.model';
import { RoomType } from 'src/app/models/roomType.enum';
import { User } from 'src/app/models/user.model';
import { ChatService } from 'src/app/services/chat.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-room-options',
  templateUrl: './room-options.component.html',
  styleUrls: ['./room-options.component.css']
})
export class RoomOptionsComponent implements OnInit, OnDestroy{
  private subscription0?:Subscription
  private subscription1?:Subscription
  private subscription2?:Subscription
  private subscription3?:Subscription
  private subscription4?:Subscription
  private subscription5?:Subscription

  userId?:number;
  room:Room = {}
  members:{user:User, type:string, click:boolean, admin:boolean, removed:boolean}[] = []
  form = new FormGroup({password:new FormControl});
  type?:RoomType
  clickOnUser:{user:User, click:boolean}[] = [];
  newAdminsId:number[] = []
  removedId:number[] = []
  isAdmin:boolean = false

  constructor(private chatService:ChatService, private loginService:LoginService) {
    this.subscription0 = this.loginService.userId.pipe(take(1)).subscribe((id?:any) => {
      this.userId = id;
    })

    this.subscription1 = chatService.roomOptions$.subscribe(data=>{
      this.room = data
      if (this.room.adminId?.includes(this.userId!))
        this.isAdmin = true
      this.chatService.sendToGetRoomById(this.room.id!);
      this.chatService.sendToGetRoomMembers(this.room);////////
    })
    this.type = this.room.type
    this.chatService.sendToGetRoomMembers(this.room);

    this.subscription2 = this.chatService.getRoomById().subscribe(data=>this.chatService.roomOptionsSource.next(data));
    this.subscription3 = this.chatService.getRoomMembers().subscribe(users=> {
      this.members = []
      users.forEach(user=> {
        if (user.user.id !== this.userId)
          this.members.push({user:user.user, type:user.type, click:false, admin:false, removed:false})
      })
    })
  }

  ngOnInit(): void {
  }

  changeType(type:string) {
    if (type === 'public')
      this.type = RoomType.PUBLIC
    else if(type === 'protected')
      this.type = RoomType.PROTECTED
    else if(type === 'private')
      this.type = RoomType.PRIVATE
  }

  clickOnMember(member:{user:User, type:string, click:boolean, admin:boolean, removed:boolean}) {
    member.click = !member.click
  }

  addAdmin(member:{user:User, type:string, click:boolean, admin:boolean, removed:boolean}) {
    if (this.room.adminId?.includes(member.user.id!)) return
    member.click = !member.click
    member.admin = !member.admin
    if (member.admin)
      this.newAdminsId.push(member.user.id!)
    else
      this.newAdminsId = this.newAdminsId.filter(id=> id !== member.user.id)
  }

  removeMember(member:{user:User, type:string, click:boolean, admin:boolean, removed:boolean}) {
    if (this.room.adminId?.includes(member.user.id!)) return
    member.click = !member.click
    member.removed = !member.removed
    if (member.removed)
      this.removedId.push(member.user.id!)
    else
      this.removedId = this.removedId.filter(id=> id !== member.user.id)
  }

  saveRoom() {
    this.chatService.sendToGetRoomMembers(this.room)
    this.room.type = this.type
    this.room.adminId = this.room.adminId?.concat(this.newAdminsId)
    this.removedId.forEach(id=> {
      this.room.usersId = this.room.usersId?.filter(item=> item !== id)
    })
    if (this.form.value.password) {
      this.room.password = this.form.value.password;
      this.chatService.roomOptionsSource.next(this.room)////////////
      this.chatService.updateRoom(this.room);
      this.chatService.displayComponents(false, true, false, true, true, false)
    }
    else if (this.type !== RoomType.PROTECTED) {
      const data = this.room
      console.log(this.room.type);
      
      this.chatService.roomOptionsSource.next(this.room)////////////
      this.chatService.updateRoom(this.room);
      this.chatService.displayComponents(false, true, false, true, true, false)
    }
  }

  back() {
    this.chatService.displayComponents(false, true, false, true, true, false)
    this.subscription4 = this.chatService.roomOptions$.subscribe(data=>{
      this.room = data
    })
  }

  exitRoom() {
    this.room.usersId = this.room.usersId?.filter(id=> id !== this.userId);
    this.chatService.updateRoom(this.room)
      for(let i:number = 0;i < 10;i++) {
        this.chatService.sendToGetRooms(this.userId!);
      }
      this.subscription5 = this.chatService.getRooms().subscribe(data=> {this.chatService.updateRooms(data);})
      this.chatService.displayComponents(false, false, false, true, true, false)
  }

  ngOnDestroy(): void {
    this.subscription0?.unsubscribe()
    this.subscription1?.unsubscribe()
    this.subscription2?.unsubscribe()
    this.subscription3?.unsubscribe()
    this.subscription4?.unsubscribe()
    this.subscription5?.unsubscribe()
  }
}
