import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatService } from '../../../services/chat.service';
import { Room } from 'src/app/models/room.model';
import { Message } from 'src/app/models/message.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit, OnDestroy {

  @Output() conversData = new EventEmitter<Room>()
  
  private subscriptions: Subscription[] = []

  smallScreen:boolean = false;
  screenWidth: number = 1000;
  
  userId?:number;

  rooms:Room[] = []
  color:any = {color:'', name:''}
  lastMessages: Message[] = [];
  selectedRoom?:Room

  constructor(private authService:AuthService, private chatService:ChatService) {
    this.userId = this.authService.getLoggedInUserId();

    this.screenWidth = window.innerWidth;
    window.addEventListener('resize', this.onResize.bind(this));

    const subs1:Subscription = this.chatService.getRoomMessage().subscribe(data=>{
      this.sortConversations(data);
      chatService.chatNotifSource.next(0)
      this.chatService.updateRoomLastMessage(data);
    })
    this.subscriptions.push(subs1)

    const subs3:Subscription = chatService.roomLastMessage$.subscribe(data=>{
      this.lastMessages = this.lastMessages.filter(item => !(item.roomId === data.roomId));
      this.lastMessages.push(data)
    })
    this.subscriptions.push(subs3)
  }

  editeDateFormat(date:Date) {
    if (!date) return
    const newDate = new Date(date)
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',   // Two-digit day
      month: '2-digit', // Two-digit month
      year: 'numeric'   // Full year
    };
    
    const formattedDate: string = newDate.toLocaleDateString('en-GB', options);
    return formattedDate
  }

  ngOnInit(): void {
    this.chatService.sendToGetRooms(this.userId!);
    const subs1:Subscription = this.chatService.getRooms().subscribe(data=>{
      this.rooms = []
      data.forEach(item=> {
        this.rooms.push(item)
      })
      this.chatService.updateRooms(this.rooms)
    })
    this.subscriptions.push(subs1)

    const subs2:Subscription = this.chatService.rooms$.subscribe(data=>this.rooms = data)
    this.subscriptions.push(subs2)

    this.chatService.sendToGetRoomLastMessage(this.userId!)
    const subs4:Subscription = this.chatService.getRoomLastMessage().subscribe(data=> {
      this.chatService.chatNotifSource.next(0)
      data.sort((a:Message, b:Message)=>a.id! - b.id!)
      data.forEach(data=> {
        this.lastMessages = this.lastMessages.filter(item => !(item.roomId === data.roomId));
        this.lastMessages.push(data)
      })

      // SORT ROOMS CONVERSATIONS BY THE LAST MESSAGE
      let sortedUsers:Room[] = [];
      this.lastMessages.sort((a:Message, b:Message)=> b.id! - a.id!)
      this.lastMessages.forEach(message=> {
        let room:Room = this.rooms.filter(item=> item.id === message.roomId)[0]
        if (room)
          if (room.usersId?.includes(this.userId!))
            sortedUsers.push(room);
      })
      
      if (sortedUsers.length === this.rooms.length) {
        this.rooms = sortedUsers
        this.chatService.updateRooms(sortedUsers);
      }
      else {
        if (sortedUsers.length) {
          sortedUsers.forEach(room=> this.rooms = this.rooms.filter(item=> item.id !== room.id))
          let top:Room[] = sortedUsers
          this.rooms = top.concat(this.rooms)
        }
        this.chatService.updateRooms(this.rooms);
      }
    })
    this.subscriptions.push(subs4)
  }

  onResize() {
    this.screenWidth = window.innerWidth;
  }

  displayOtherRooms() {
    this.chatService.displayComponents(false, false, true, true, false, false, false);
  }

  openRoom(room:Room) {
    //  IF THE SCREEN WIDTH < 1350 SO THE CONVERSATION BUTTON COLOR WILL NOT CHANGE WHEN THE USER CLICK IT
    if (this.screenWidth > 1350) {
      this.color = {color:'#d3814674', name:room.name}
    }
    else
      this.color = {color:'', name:''}
    this.chatService.sendToGetRoomMembers(room);
    this.conversData.emit(room);
  }

  sortConversations(message:Message) {
    let newList:Room[] = []
    const room:Room = this.rooms.filter(item=> item.id === message.roomId)[0];
    newList.push(room);
    this.rooms.forEach(item=> {
      if (item.id !== message.roomId)
        newList.push(item)
    })
    this.chatService.roomsSource.next(newList)
  }

  ngOnDestroy(): void {
    this.chatService.updateRooms([])

    this.subscriptions.forEach(sub=>sub.unsubscribe())
  }
}
