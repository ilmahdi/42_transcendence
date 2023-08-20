import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import * as _ from 'lodash';
import { Socket } from 'ngx-socket-io';
import Pusher from 'pusher-js';
import { Observable, take } from 'rxjs';
import { Message } from 'src/app/models/message.model';
import { Room } from 'src/app/models/room.model';
import { User } from 'src/app/models/user.model';
import { ChatService } from 'src/app/services/chat.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.css']
})
export class ConversationsComponent implements OnInit, OnDestroy {

  @Input() userEmitted:any
  @Input() conversationEmitted:Message[] = [];
  @Input() roomConvers?:any
  @Output() getconvers = new EventEmitter<boolean>()
  displayConv:boolean = true
  userId?:number
  user?:User

  msg = new FormGroup({message: new FormControl})

  messages: Message[] = [];
  roomMessage:Message[] =[]
  
  users:User[] = [];
  lastMessages:any[] = []

  addRoom:boolean = false
  constructor(private chatService: ChatService, private loginService:LoginService) {
    this.loginService.userId.pipe(take(1)).subscribe((id?:any) => {
      this.userId = id;
    })

    loginService.user.pipe(take(1)).subscribe((data?:any) => {
      this.user = data;
    })

    chatService.add$.subscribe(data=>this.addRoom = data)
  }

  ngOnInit() {
    // FOR PRIVATE MESSAGE
    this.chatService.conversation$.subscribe(data=> this.messages = data)
    this.chatService.getNewMessage().subscribe(data=>{
        this.chatService.updateLastMessage(data);
       this.messages.push(data)
       this.messages = _.sortBy(this.messages, 'date');
       this.chatService.sendToGetLastMessage(this.userId!)
      })
    
    // FOR ROOM MESSAGE
    this.chatService.roomConversation$.subscribe(data=>{
      this.roomMessage = data
    })
    this.chatService.getRoomMessage().subscribe(data=>this.roomMessage.push(data))
  }

  getConversEvent() {
    this.getconvers.emit(true);
    this.userEmitted[1] = false;
  }

  sendPrivateMessage() {
    let message = this.msg.value.message
    let senderId = this.userId
    let receiverId = this.userEmitted[0].id
    let date = new Date()
    
    const msg = {senderId, receiverId, message, date}
    if (!message) return;
    this.chatService.updateSocketId(this.userId!)
    this.chatService.sendNewMessage(msg, this.userEmitted[0])
    this.msg.reset();
    this.chatService.sendToGetLastMessage(this.userId!)
    this.chatService.updateLastMessage(msg)
    this.messages = _.sortBy(this.messages, 'date');
  }

  sendRoomMessage() {
    const msg = {senderId:this.userId, receiverId:this.userId, message:this.msg.value.message, date:new Date(), readed:false, roomId:this.roomConvers[0].id}
    if (!msg.message) return;
    this.chatService.sendRoomMessage(this.userId!, this.roomConvers[0], msg)
    this.msg.reset();
  }

  ngOnDestroy(): void {
  }
}
