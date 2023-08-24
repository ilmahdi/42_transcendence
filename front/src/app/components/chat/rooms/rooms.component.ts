import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { take } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { ChatService } from '../../../services/chat.service';
import { Room } from 'src/app/models/room.model';
import { Message } from 'src/app/models/message.model';
import * as _ from 'lodash';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit, OnDestroy {

  @Output() conversData = new EventEmitter<Room>()
  smallScreen:boolean = false;
  screenWidth: number = 1000;
  
  userId?:number;

  rooms:Room[] = []
  messages:Message[] = []
  color:any = {color:'', name:''}
  lastMessages: any[] = [];
  selectedRoom?:Room

  constructor(private loginService:LoginService, private chatService:ChatService) {
    this.loginService.userId.pipe(take(1)).subscribe((id?:any) => {
      this.userId = id;
    })

    this.screenWidth = window.innerWidth;
    window.addEventListener('resize', this.onResize.bind(this));

    this.chatService.getRoomMessage().subscribe(data=>{
      this.chatService.updateRoomLastMessage(data);})

    chatService.sendToGetRoomLastMessage(this.userId!)
    this.chatService.getRoomLastMessage().subscribe(data=> {
      data.forEach(data=> {
        this.lastMessages = this.lastMessages.filter(item => !(item.roomId === data.roomId));
        this.lastMessages.push(data)
        chatService.roomLastMessage$.subscribe(data=>{
          if (this.lastMessages[this.lastMessages.length - 1] !== data) {
            this.lastMessages = this.lastMessages.filter(item => !(item.roomId === data.roomId));
            this.lastMessages.push(data)
          }
        })
        this.lastMessages = _.sortBy(this.lastMessages, 'date');
      })
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
    this.chatService.getRooms().subscribe(data=>{
      this.rooms = []
      data.forEach(item=> {
        this.rooms.push(item)
      })
      this.chatService.updateRooms(this.rooms)
    })

    this.chatService.rooms$.subscribe(data=>{this.rooms = data})
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

  ngOnDestroy(): void {
    this.chatService.updateRooms([])
  }
}
