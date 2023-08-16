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
  user?:User

  @Input() latest:Message[] = []
  saad:{friend:User, message:Message}[] = []
  constructor(private chatService:ChatService, private loginService:LoginService) {
    this.loginService.userId.pipe(take(1)).subscribe((id?:any) => {
      this.userId = id;
    })

    loginService.user.pipe(take(1)).subscribe((data?:any) => {
      this.user = data;
    })

    this.screenWidth = window.innerWidth;
    window.addEventListener('resize', this.onResize.bind(this));

    // this.chatService.sendNewMessage({id:0, senderId:this.userId, receiverId:this.userId, message:"Welcome", date:new Date}, this.user)
    this.chatService.getNewMessage().subscribe(data=>{
      this.chatService.updateLastMessage(data);})

    this.chatService.getLastMessage().subscribe(data=> {
      data.forEach(data=> {
        this.lastMessages = this.lastMessages.filter(item => !((item.receiverId === data.receiverId && item.senderId === data.senderId) || (item.senderId === data.receiverId && item.receiverId === data.senderId)));
        this.lastMessages.push(data)
        chatService.string$.subscribe(data=>{
          if (this.lastMessages[this.lastMessages.length - 1] !== data) {
            this.lastMessages = this.lastMessages.filter(item => !((item.receiverId === data.receiverId && item.senderId === data.senderId) || (item.senderId === data.receiverId && item.receiverId === data.senderId)));
            this.lastMessages.push(data)
          }
        })
        this.lastMessages = _.sortBy(this.lastMessages, 'date');
        // MAKAYDKHELX HNA ILA KANT LCONVERSATIION KHAWYA
      })
    })
  }

  ngOnInit(): void {
    this.chatService.getUsers().subscribe((data) => {
      data.forEach((user)=>{
        if (user.id != this.userId) {
          this.users?.push(user)
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
          this.messages.push(item)
      })
    })
    this.chatService.lastConversation = {name:name, friend:friend};
    this.conversation.emit(this.messages);
    this.customEvent.emit(friend)
  }

  ngOnDestroy(): void {
    this.messages = []
  }

}
