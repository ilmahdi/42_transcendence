import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { Subscription, take } from 'rxjs';
import { ChatService } from '../../../services/chat.service';
import { Room } from 'src/app/models/room.model';
import { Message } from 'src/app/models/message.model';
import * as _ from 'lodash';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit, OnDestroy {

  @Output() conversData = new EventEmitter<Room>()
  
  private subscription0?: Subscription
  private subscription1?: Subscription
  private subscription2?: Subscription
  private subscription3?: Subscription
  private subscription4?: Subscription
  private subscription5?: Subscription
  private subscription6?: Subscription
  private subscription7?: Subscription
  private subscription8?: Subscription

  smallScreen:boolean = false;
  screenWidth: number = 1000;
  
  userId?:number;

  rooms:Room[] = []
  messages:Message[] = []
  color:any = {color:'', name:''}
  lastMessages: any[] = [];
  selectedRoom?:Room

  notReaded:{senderId:number, roomId: number; unreadCount: number }[] = []
  constructor(private authService:AuthService, private chatService:ChatService) {
    this.userId = this.authService.getLoggedInUserId();

    this.screenWidth = window.innerWidth;
    window.addEventListener('resize', this.onResize.bind(this));

    chatService.sendToGetNotReadedRoomMessages(this.userId!);
    this.subscription1 = this.chatService.getRoomMessage().subscribe(data=>{
      this.chatService.updateRoomLastMessage(data);
      
    })
    this.subscription2 = chatService.getNotReadedRoomMessages().subscribe(data=>{
      chatService.updateReadRoomBehav(data);
    })

    this.subscription3 = chatService.roomLastMessage$.subscribe(data=>{
      this.lastMessages = this.lastMessages.filter(item => !(item.roomId === data.roomId));
      this.lastMessages.push(data)
      if (this.notReaded.some(item => item.roomId === data.roomId)) {
        this.notReaded.map(item=> {
          if (item.roomId === data.roomId) {
            item.unreadCount++;
          }
        })
      }
      else {
        this.notReaded.push({senderId:data.senderId, roomId:data.roomId, unreadCount:1})
      }
    })
  }

  editeDateFormat(date:Date) {
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
    this.subscription4 = this.chatService.getRooms().subscribe(data=>{
      this.rooms = []
      data.forEach(item=> {
        this.rooms.push(item)
      })
      this.chatService.updateRooms(this.rooms)
    })

    this.subscription5 = this.chatService.rooms$.subscribe(data=>this.rooms = data)

    this.chatService.sendToGetNotReadedRoomMessages(this.userId!);
    this.subscription6 = this.chatService.notReadedRoomMessage$.subscribe(data=>{
      this.notReaded = [];
      data.forEach(item=>this.notReaded.push(item));
    })

    this.chatService.sendToGetRoomLastMessage(this.userId!)
    this.subscription7 = this.chatService.getRoomLastMessage().subscribe(data=> {
      data.sort((a:Message, b:Message)=>a.id! - b.id!)
      data.forEach(data=> {
        this.lastMessages = this.lastMessages.filter(item => !(item.roomId === data.roomId));
        this.lastMessages.push(data)
        this.lastMessages = _.sortBy(this.lastMessages, 'date');
      })
    })
  }

  onResize() {
    this.screenWidth = window.innerWidth;
  }

  displayOtherRooms() {
    this.chatService.displayComponents(false, false, true, true, true, false, false);
  }

  openRoom(room:Room) {
    //  IF THE SCREEN WIDTH < 1350 SO THE CONVERSATION BUTTON COLOR WILL NOT CHANGE WHEN THE USER CLICK IT
    if (this.screenWidth > 1350) {
      this.color = {color:'#D38146', name:room.name}
    }
    else
      this.color = {color:'', name:''}

    //  GET THE CONVERSATION FROM SERVER
    this.chatService.sendToGetRoomConversation(room)
    this.subscription8 = this.chatService.getRoomConversation().subscribe((data) => {
      data.sort((a:Message, b:Message)=>a.id! - b.id!)
      this.chatService.updateRoomConversation(data);
      this.messages.splice(0, this.messages.length);
      data.forEach((item)=>{
        this.messages.push(item)
        if (item.senderId !== this.userId) {
          this.chatService.updateRead(item)
          this.chatService.updateReadRoomBehav(this.notReaded.filter(shit=> shit.roomId !== item.roomId));
        }
      })
    })
    // this.chatService.updateRoomConversation(this.messages);
    this.chatService.displayComponents(false, true, false, true, false, false, false);
    this.chatService.roomOptionsSource.next(room);////////////
    this.conversData.emit(room);
  }

  ngOnDestroy(): void {
    this.chatService.updateRooms([])

    this.subscription0?.unsubscribe()
    this.subscription1?.unsubscribe()
    this.subscription2?.unsubscribe()
    this.subscription3?.unsubscribe()
    this.subscription4?.unsubscribe()
    this.subscription5?.unsubscribe()
    this.subscription6?.unsubscribe()
    this.subscription7?.unsubscribe()
    this.subscription8?.unsubscribe()
  }
}
