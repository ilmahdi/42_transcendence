import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import * as _ from 'lodash';
import { Socket } from 'ngx-socket-io';
import Pusher from 'pusher-js';
import { Observable, take, Subscription } from 'rxjs';
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
  private subsciption1?:Subscription
  private subsciption2?:Subscription
  private subsciption3?:Subscription
  private subsciption4?:Subscription
  private subsciption5?:Subscription
  private subsciption6?:Subscription
  private subsciption7?:Subscription
  private subsciption8?:Subscription

  @Input() userEmitted:any
  @Input() conversationEmitted:Message[] = [];
  @Input() roomConvers?:any
  userId?:number
  user?:User

  msg = new FormGroup({message: new FormControl})

  messages: Message[] = [];
  roomMessage:Message[] =[]
  
  users:User[] = [];

  displayConversation:boolean = true
  options:boolean = false
  addMember:boolean = false

  constructor(private chatService: ChatService, private loginService:LoginService) {
    this.chatService.optionsSource.next(false)
    this.subsciption1 = this.loginService.userId.pipe(take(1)).subscribe((id?:any) => {
      this.userId = id;
    })

    this.subsciption3 = chatService.displayConversation$.subscribe(data=>this.displayConversation = data)
    this.subsciption4 = this.chatService.options$.subscribe(data=>this.options = data)
    this.subsciption2 = chatService.addMember$.subscribe(data=>this.addMember = data)
  }

  ngOnInit() {
    // FOR PRIVATE MESSAGE
    this.subsciption5 = this.chatService.conversation$.subscribe(data=> this.messages = data)
    this.subsciption6 = this.chatService.getNewMessage().subscribe(data=>{
        this.chatService.updateLastMessage(data);
       this.messages.push(data)
      //  this.messages = _.sortBy(this.messages, 'date');
       this.chatService.sendToGetLastMessage(this.userId!)
      })
    
    // FOR ROOM MESSAGE
    this.subsciption7 = this.chatService.roomConversation$.subscribe(data=>{
      this.roomMessage = data;
    })
    this.subsciption8 = this.chatService.getRoomMessage().subscribe(data=>{
      this.chatService.updateRoomLastMessage(data);
      this.roomMessage.push(data)
      this.messages = _.sortBy(this.messages, 'date');
      this.chatService.sendToGetRoomLastMessage(this.userId!)
    })
  }

  openOptions() {
    // this.chatService.roomOptionsSource.next(this.roomConvers[0])
    this.chatService.displayComponents(false, false, false, true, true, true, false)
  }

  getConversEvent() {
    this.chatService.displayComponents(false, false, false, false, false, false, false)
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
    const msg = {senderId:this.userId, receiverId:this.roomConvers[0].id, message:this.msg.value.message, date:new Date(), readed:false, roomId:this.roomConvers[0].id}
    if (!msg.message) return;
    this.chatService.updateSocketId(this.userId!)
    this.chatService.sendRoomMessage(this.userId!, this.roomConvers[0], msg)
    this.msg.reset();
    this.chatService.sendToGetRoomLastMessage(this.userId!);
    this.chatService.updateRoomLastMessage(msg)
    this.messages = _.sortBy(this.messages, 'date');
  }

  ngOnDestroy(): void {
    this.subsciption1?.unsubscribe()
    this.subsciption2?.unsubscribe()
    this.subsciption3?.unsubscribe()
    this.subsciption4?.unsubscribe()
    this.subsciption5?.unsubscribe()
    this.subsciption6?.unsubscribe()
    this.subsciption7?.unsubscribe()
    this.subsciption8?.unsubscribe()
  }
}
