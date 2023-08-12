import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
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
export class ConversationsComponent implements OnInit {

  @Input() userEmitted:any
  @Input() conversationEmitted:Message[] = [];
  @Output() getconvers = new EventEmitter<boolean>()
  @Output() lastMessage = new EventEmitter<Message>()
  displayConv:boolean = true
  userId?:number

  msg = new FormGroup({message: new FormControl})

  messages: Message[] = [];
  
  constructor(private chatService: ChatService, private loginService:LoginService) {
    this.loginService.userId.pipe(take(1)).subscribe((id?:any) => {
      this.userId = id
    })
  }

  ngOnInit() {
    // this.chatService.sendToGetConversation(this.userId!, this.userEmitted.id!)
    // this.chatService.getConversation().
    // subscribe((data) => {
    //   this.messages.splice(0, this.messages.length);
    //   data.forEach((item)=>{
    //       this.messages.push(item)
    //   })
    // })


    this.messages = this.conversationEmitted
    return this.chatService.getNewMessage().subscribe(data=>{
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
    
    const msg = {senderId, receiverId, message}
    if (!message) return;
    // this.userEmitted[0].socketId = this.chatService.getUpdatedSocketId();
    this.chatService.updateSocketId(this.userId!)
    this.chatService.sendNewMessage(msg, this.userEmitted[0])
    this.lastMessage.emit(msg);
    // this.chatService.sendMessage(msg).subscribe()
    this.msg.reset();
  }
}
