import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgModel } from '@angular/forms';
import { Subscription, take } from 'rxjs';
import { Mute } from 'src/app/models/mutes.model';
import { Room } from 'src/app/models/room.model';
import { RoomType } from 'src/app/models/roomType.enum';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { IUserDataShort } from 'src/app/utils/interfaces/user-data.interface';

@Component({
  selector: 'app-room-options',
  templateUrl: './room-options.component.html',
  styleUrls: ['./room-options.component.css']
})
export class RoomOptionsComponent implements OnInit, OnDestroy{
  private subscriptions:Subscription[] = []


  userId?:number;
  room:Room = {}
  members:{user:IUserDataShort, type:string, click:boolean, admin:boolean, removed:boolean, mute:boolean, muteDuration: number, ban:boolean}[] = []
  form = new FormGroup({password:new FormControl, mute:new FormControl<string[]>([])});
  type?:RoomType
  clickOnUser:{user:IUserDataShort, click:boolean}[] = [];
  newAdminsId:number[] = []
  removedId:number[] = []
  blackList:number[] = []
  isAdmin:boolean = false

  constructor(private chatService:ChatService, private authService:AuthService) {
    this.userId = this.authService.getLoggedInUserId();

    const subs:Subscription = chatService.roomOptions$.subscribe(data=>{
      this.room = data
      if (this.room.adminId?.includes(this.userId!))
        this.isAdmin = true
      this.chatService.sendToGetRoomById(this.room.id!);
    })
    this.subscriptions.push(subs)
    this.type = this.room.type
  }

  ngOnInit(): void {
    this.chatService.sendToGetRoomMembers(this.room);
    const subs1:Subscription = this.chatService.getRoomById().subscribe(data=>this.chatService.roomOptionsSource.next(data));
    this.subscriptions.push(subs1)
    const subs2:Subscription = this.chatService.getRoomMembers().subscribe(users=> {
      this.members = []
      users.forEach(user=> {
        if (user.user.id !== this.userId)
          this.members.push({user:user.user,
            type:user.type,
            click:false, admin:false,
            removed:false,
            mute:false,
            muteDuration: 0,
            ban:false})
      })
    })
    this.subscriptions.push(subs2)
  }

  changeType(type:string) {
    if (type === 'public')
      this.type = RoomType.PUBLIC
    else if(type === 'protected')
      this.type = RoomType.PROTECTED
    else if(type === 'private')
      this.type = RoomType.PRIVATE
  }

  clickOnMember(member:{user:IUserDataShort,
    type:string,
    click:boolean,
    admin:boolean,
    removed:boolean,
    mute:boolean,
    muteDuration: number,
    ban:boolean}) {
    member.click = !member.click
    // member.mute = !member.mute
  }

  addAdmin(member:{user:IUserDataShort,
    type:string,
    click:boolean,
    admin:boolean,
    removed:boolean,
    mute:boolean,
    muteDuration: number,
    ban:boolean}) {
    if (this.room.adminId?.includes(member.user.id!)) return
    member.click = !member.click
    member.admin = !member.admin
    member.removed = false
    member.ban = false
    if (member.admin)
      this.newAdminsId.push(member.user.id!)
    else
      this.newAdminsId = this.newAdminsId.filter(id=> id !== member.user.id)
    this.blackList = this.blackList.filter(id=> id !== member.user.id)
    this.removedId = this.removedId.filter(id=> id !== member.user.id)
  }

  removeMember(member:{user:IUserDataShort,
    type:string,
    click:boolean,
    admin:boolean,
    removed:boolean,
    mute:boolean,
    muteDuration: number,
    ban:boolean}) {
    if (this.room.adminId?.includes(member.user.id!)) return
    member.click = !member.click
    member.removed = !member.removed
    member.admin = false
    member.ban = false
    member.mute = false
    member.muteDuration = 0
    if (member.removed)
      this.removedId.push(member.user.id!)
    else
      this.removedId = this.removedId.filter(id=> id !== member.user.id)
    this.blackList = this.blackList.filter(id=> id !== member.user.id)
    this.newAdminsId = this.newAdminsId.filter(id=> id !== member.user.id)
  }

  muting(member:{user:IUserDataShort,
    type:string,
    click:boolean,
    admin:boolean,
    removed:boolean,
    mute:boolean,
    muteDuration: number,
    ban:boolean}) {
    member.click = !member.click;
    member.mute = !member.mute
    member.muteDuration = 0;
    member.ban = false;
    this.blackList = this.blackList.filter(id=> id !== member.user.id)
    this.removedId = this.removedId.filter(id=> id !== member.user.id)
    this.newAdminsId = this.newAdminsId.filter(id=> id !== member.user.id)
  }

  clickOnInput(member:{user:IUserDataShort,
    type:string,
    click:boolean,
    admin:boolean,
    removed:boolean,
    mute:boolean,
    muteDuration: number,
    ban:boolean}, event :Event) {
    
    event.stopPropagation();
    member.removed = false
    member.admin = false
    member.ban = false
    this.blackList = this.blackList.filter(id=> id !== member.user.id)
    this.removedId = this.removedId.filter(id=> id !== member.user.id)
    this.newAdminsId = this.newAdminsId.filter(id=> id !== member.user.id)
  }

  banUser(member:{user:IUserDataShort,
    type:string,
    click:boolean,
    admin:boolean,
    removed:boolean,
    mute:boolean,
    muteDuration: number,
    ban:boolean}) {
    member.click = !member.click
    member.ban = !member.ban
    member.removed = false
    member.admin = false
    member.mute = false
    if (member.ban) {
      this.blackList.push(member.user.id!);
      this.removedId.push(member.user.id!)
    }
    else {
      this.blackList = this.blackList.filter(id=> id !== member.user.id)
      this.removedId = this.removedId.filter(id=> id !== member.user.id)
    }
    this.newAdminsId = this.newAdminsId.filter(id=> id !== member.user.id)
  }

  saveRoom() {
    this.chatService.sendToGetRoomMembers(this.room)
    this.room.type = this.type
    this.room.adminId = this.room.adminId?.concat(this.newAdminsId)
    this.room.blackList = this.room.blackList?.concat(this.blackList);
    
    this.removedId.forEach(id=> {
      this.room.usersId = this.room.usersId?.filter(item=> item !== id)
    })
    if (this.form.value.password) {
      this.room.password = this.form.value.password;
    }

    const mutedUserDurations: Mute[] = this.members
    .filter((member) => member.mute)
    .map((member) => ({
      userId: member.user.id!,
      during: member.muteDuration,
      roomId: this.room.id,
    }));
    this.room.mutes = mutedUserDurations

    this.chatService.roomOptionsSource.next(this.room)
    this.chatService.sendToGetRoomMembers(this.room);
    if (this.form.value.password)   // UPDATE THE PASSWORD IN DATABASE
      this.chatService.updateRoom(this.room, true);
    else                            // DON'T UPDATE THE PASSWORD IN DATABASE
      this.chatService.updateRoom(this.room, false);
    this.chatService.displayComponents(false, true, false, true, false, false, false)
  }

  addMembers() {
    this.chatService.displayComponents(false, false, false, true, false, false, true)
  }

  back() {
    this.chatService.displayComponents(false, true, false, true, false, false, false)
    const subs:Subscription = this.chatService.roomOptions$.subscribe(data=>{
      this.room = data
    })
    this.subscriptions.push(subs)
  }

  exitRoom() {
    this.room.usersId = this.room.usersId?.filter(id=> id !== this.userId);
    this.chatService.updateRoom(this.room, false)
    const newRooms:Room[] = this.chatService.roomsSource.value.filter(room=> room.id !== this.room.id)
    this.chatService.roomsSource.next(newRooms)
    this.chatService.displayComponents(false, false, false, true, true, false, false)
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>sub.unsubscribe())
  }
}
