import { Component, OnInit, OnDestroy } from '@angular/core';
import { take, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { Room } from 'src/app/utils/interfaces/room.model';
import { IUserData } from 'src/app/utils/interfaces/user-data.interface';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.css']
})
export class AddMemberComponent implements OnInit, OnDestroy {
  private subscription1?:Subscription
  private subscription2?:Subscription
  private subscription3?:Subscription
  private subscription4?:Subscription
  private subscription5?:Subscription
  userId?:number
  room:Room = {}
  isAdmin:boolean = false
  display:boolean = false
  users:{user:IUserData, type:string, click:boolean, admin:boolean, removed:boolean}[] = []
  newAdminsId:number[] = []
  searchQuery: string = '';
  searchResults: IUserData[] = [];

  constructor(private chatService:ChatService, private authService:AuthService) {
    this.subscription1 = this.authService.userId.pipe(take(1)).subscribe((id?:any) => {
      this.userId = id;
    })

    this.subscription3 = chatService.roomOptions$.subscribe(data=>{
      this.room = data
      if (this.room.adminId?.includes(this.userId!))
        this.isAdmin = true
      this.chatService.sendToGetRoomById(this.room.id!);
    })
  }

  ngOnInit(): void {
    this.subscription4 = this.chatService.getUsers().subscribe(data=> {
      data.forEach(user=>{
        if (user.id !== this.userId && !this.room.usersId?.includes(user.id!))
          this.users.push({user:user, type:'user', click:false, admin:false, removed:false});
      })
    })
  }

  searchQueryUser() {
    this.subscription5 = this.chatService.searchConvers(this.searchQuery).subscribe(data=>{
      this.searchResults = data
      this.users = []
      data.forEach(user=>{
        if (user.id !== this.userId && !this.room.usersId?.includes(user.id!))
          this.users.push({user:user, type:'user', click:false, admin:false, removed:false});
      })
    })
  }

  clickOnMember(member:{user:IUserData, type:string, click:boolean, admin:boolean, removed:boolean}) {
    member.click = !member.click
  }

  addAdmin(member:{user:IUserData, type:string, click:boolean, admin:boolean, removed:boolean}) {
    if (this.room.adminId?.includes(member.user.id!)) return
    member.click = !member.click
    member.admin = !member.admin
    if (member.admin)
      this.newAdminsId.push(member.user.id!)
    else
      this.newAdminsId = this.newAdminsId.filter(id=> id !== member.user.id)
  }

  addMembers() {
    let newUsers:number[] = []
    this.users.forEach(user=>{
      if (user.click)
        newUsers.push(user.user.id!);
    })
    this.chatService.sendToGetRoomMembers(this.room);
    this.room.usersId = this.room.usersId?.concat(newUsers);
    this.room.adminId = this.room.adminId?.concat(this.newAdminsId);
    this.chatService.updateRoom(this.room);
    this.chatService.displayComponents(false, true, false, true, true, false, false)
  }

  back() {
    this.chatService.displayComponents(false, false, false, true, true, true, false)
  }

  ngOnDestroy(): void {
    this.subscription1?.unsubscribe()
    this.subscription2?.unsubscribe()
    this.subscription3?.unsubscribe()
    this.subscription4?.unsubscribe()
    this.subscription5?.unsubscribe()
  }
}
