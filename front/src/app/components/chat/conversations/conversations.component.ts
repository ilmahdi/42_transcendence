import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { Socket } from 'ngx-socket-io';
import Pusher from 'pusher-js';
import { Observable, take } from 'rxjs';
import { Message } from 'src/app/models/message.model';
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
  @Output() getconvers = new EventEmitter<boolean>()
  displayConv:boolean = true
  userId?:number
  user?:User

  msg = new FormGroup({message: new FormControl})

  messages: Message[] = [];
  
  users:User[] = [];
  lastMessage:any[] = []
  constructor(private chatService: ChatService, private loginService:LoginService) {
    this.loginService.userId.pipe(take(1)).subscribe((id?:any) => {
      this.userId = id;
    })

    loginService.user.pipe(take(1)).subscribe((data?:any) => {
      this.user = data;
    })
  }

  ngOnInit() {
    this.messages = this.conversationEmitted
    return this.chatService.getNewMessage().subscribe(data=>{
      // if (data.receiverId === this.userId)
      //   this.chatService.updateLastMessage(this.user!, data.message!);
      // else
        this.chatService.updateLastMessage(this.userEmitted[0], data);
       this.messages.push(data)})
  }

  getConversEvent() {
    this.getconvers.emit(true);
    this.userEmitted[1] = false;
  }

  onSubmit() {
    let message = this.msg.value.message
    let senderId = this.userId
    let receiverId = this.userEmitted[0].id
    let date = new Date()
    
    const msg = {senderId, receiverId, message, date}
    if (!message) return;
    this.chatService.updateSocketId(this.userId!)
    this.chatService.sendNewMessage(msg, this.userEmitted[0])
    // this.chatService.updateLastMessage(this.user!, msg.message);
    this.msg.reset();
  }

  ngOnDestroy(): void {
    console.log("DESTROYED");
  }
}
