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

  private subscription0?: Subscription
  private subscription1?: Subscription
  private subscription2?: Subscription
  private subscription3?: Subscription
  private subscription4?: Subscription
  private subscription5?: Subscription
  private subscription6?: Subscription
  private subscription7?: Subscription
  private subscription8?: Subscription
  private subscription9?: Subscription

  users:User[] = [];
  screenWidth: number = 1000;
  color:any = {color:'', name:''}

  userId?:number;
  messages: Message[] = [];

  lastMessages: any[] = [];

  notReaded:{ senderId: number; unreadCount: number }[] = []
  constructor(private chatService:ChatService, private loginService:LoginService) {
    this.subscription0 = this.loginService.userId.pipe(take(1)).subscribe((id?:any) => {
      this.userId = id;
    })

    this.screenWidth = window.innerWidth;
    window.addEventListener('resize', this.onResize.bind(this));

    // GET THE NUMBER OF MESSAGES WHICH ARE NOT HAVE READED BY YOUR SELF WITH THE SENDER ID
    this.subscription1 = this.chatService.getNewMessage().subscribe(data1=>{
      this.chatService.updateLastMessage(data1);
      this.subscription2 = chatService.getNotReadedMessages().subscribe(data=>{
        chatService.updateReadedBehav(data);
      })
    })

    this.subscription3 = chatService.string$.subscribe(data=>{
      this.lastMessages = this.lastMessages.filter(item => !((item.receiverId === data.receiverId && item.senderId === data.senderId) || (item.senderId === data.receiverId && item.receiverId === data.senderId)));
      this.lastMessages.push(data)
      // IF YOU EALREADY HAVE AN UNREADED MESSAGE FROM THE SENDERID OR IF NO (else)
      if (this.notReaded.some(item => item.senderId === data.senderId)) {
        this.notReaded.map(item=> {
          if (item.senderId === data.senderId) {
            item.unreadCount++;
          }
        })
      }
      else {
        this.notReaded.push({senderId:data.senderId, unreadCount:1})
      }
    })
    
  }

  ngOnInit(): void {
    this.subscription4 = this.chatService.getUsers().subscribe((data) => {
      this.users = []
      data.forEach((user)=>{
        if (user.id != this.userId) {
          this.users?.push(user);
        }
      })
      this.chatService.updateUsers(this.users)
    });

    this.subscription5 = this.chatService.users$.subscribe(data=> {
      this.users = data;
    })

    this.chatService.sendToGetNotReadedMessages(this.userId!)//////////
    this.subscription6 = this.chatService.notReadedMessage$.subscribe(data=>{
      this.notReaded = [];
      data.forEach(item=>this.notReaded.push(item));
    })

    this.chatService.sendToGetLastMessage(this.userId!)
    this.subscription7 = this.chatService.getLastMessage().subscribe(data=> {
      data.sort((a:Message, b:Message)=>a.id! - b.id!)
      data.forEach(data=> {
        this.lastMessages = this.lastMessages.filter(item => !((item.receiverId === data.receiverId && item.senderId === data.senderId) || (item.senderId === data.receiverId && item.receiverId === data.senderId)));
        this.lastMessages.push(data)
      })
    })
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
    this.subscription8 = this.chatService.getConversation().subscribe((data) => {
      data.sort((a:Message, b:Message)=>a.id! - b.id!)
      this.chatService.updateConversation(data);///////
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
    // this.chatService.updateConversation(this.messages);
    this.subscription9 = this.chatService.getNotReadedMessages().subscribe(data=>{
      this.chatService.updateReadedBehav(data);
    })
    this.chatService.displayComponents(false, true, false, true, true, false, false);
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
    this.chatService.updateUsers([])

    this.subscription0?.unsubscribe()
    this.subscription1?.unsubscribe()
    this.subscription2?.unsubscribe()
    this.subscription3?.unsubscribe()
    this.subscription4?.unsubscribe()
    this.subscription5?.unsubscribe()
    this.subscription6?.unsubscribe()
    this.subscription7?.unsubscribe()
    this.subscription8?.unsubscribe()
    this.subscription9?.unsubscribe()
  }
}
