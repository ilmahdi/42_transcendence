import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { BehaviorSubject, Subscription, finalize, flatMap, last, map, take, tap } from 'rxjs';
import { Message } from 'src/app/models/message.model';
import { User } from 'src/app/models/user.model';
import * as _ from 'lodash';
import { LoginService } from 'src/app/services/login.service';
import { ConversationsComponent } from '../conversations/conversations.component';

@Component({
  selector: 'app-direct',
  templateUrl: './direct.component.html',
  styleUrls: ['./direct.component.css']
})
export class DirectComponent implements OnInit, OnDestroy {

  @Output() customEvent = new EventEmitter<User>();
  @Output() conversation= new EventEmitter<Message[]>();

  users:User[] = [];
  screenWidth: number = 1000;
  color:any = {color:'', name:''}

  userId?:number;
  messages: Message[] = [];

  lastMessages: any[] = [];
  user?:User;

  notReaded:{ senderId: number; unreadCount: number }[] = []
  constructor(private chatService:ChatService, private loginService:LoginService) {
    this.loginService.userId.pipe(take(1)).subscribe((id?:any) => {
      this.userId = id;
    })

    loginService.user.pipe(take(1)).subscribe((data?:any) => {
      this.user = data;
    })

    this.screenWidth = window.innerWidth;
    window.addEventListener('resize', this.onResize.bind(this));

    // GET THE NUMBER OF MESSAGES WHICH ARE NOT HAVE READED BY YOUR SELF WITH THE SENDER ID
    chatService.sendToGetNotReadedMessages(this.userId!)
    this.chatService.getNewMessage().subscribe(data=>{
      this.chatService.updateLastMessage(data);
      chatService.getNotReadedMessages().subscribe(data=>{
        chatService.updateReadedBehav(data);
      })
    })
    
    
    chatService.sendToGetLastMessage(this.userId!)
    this.chatService.getLastMessage().subscribe(data=> {
      data.forEach(data=> {
        this.lastMessages = this.lastMessages.filter(item => !((item.receiverId === data.receiverId && item.senderId === data.senderId) || (item.senderId === data.receiverId && item.receiverId === data.senderId)));
        this.lastMessages.push(data)
        chatService.string$.subscribe(data=>{
          chatService.sendToGetNotReadedMessages(this.userId!)//////////
          if (this.lastMessages[this.lastMessages.length - 1] !== data) {
            this.lastMessages = this.lastMessages.filter(item => !((item.receiverId === data.receiverId && item.senderId === data.senderId) || (item.senderId === data.receiverId && item.receiverId === data.senderId)));
            this.lastMessages.push(data)
            // console.log(data)
          }
        })
        this.lastMessages = _.sortBy(this.lastMessages, 'date');
        // MAKAYDKHELX HNA ILA KANT LCONVERSATIION KHAWYA
      })
    })

    chatService.notReadedMessage$.subscribe(data=>{
        this.notReaded = [];
        // this.notReaded = this.notReaded.filter(item=> item.senderId !== data[0].senderId);
        data.forEach(item=>this.notReaded.push(item));
    })
    
  }

  ngOnInit(): void {
    this.chatService.getUsers().subscribe((data) => {
      data.forEach((user)=>{
        if (user.id != this.userId) {
          this.users?.push(user);
        }
      })
    });
  }

  onResize() {
    this.screenWidth = window.innerWidth;
  }

  openConversation(name:string, friend: User): void {
    //  IF THE SCREEN WIDTH < 934 SO THE CONVERSATION BUTTON COLOR WILL NOT CHANGE WHEN THE USER CLICK IT
    if (this.screenWidth > 934) {
      this.color = {color:'#D38146', name:name}
    }
    else
      this.color = {color:'', name:''}

    //  GET THE CONVERSATION FROM SERVER
    this.chatService.sendToGetConversation(this.userId!, friend.id!)
    this.chatService.getConversation().
    subscribe((data) => {
      this.messages.splice(0, this.messages.length);
      data.forEach((item)=>{
          this.messages.push(item);
          if (item.senderId !== this.userId) {
            this.chatService.updateReaded(item);
            this.chatService.updateReadedBehav(this.notReaded.filter(shit=> shit.senderId !== item.senderId));
          }
      })
    })
    this.chatService.roomFormular(false);
    this.chatService.updateConversation(this.messages);
    this.customEvent.emit(friend)
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

  ngOnDestroy(): void {
    this.messages = []
  }

}
