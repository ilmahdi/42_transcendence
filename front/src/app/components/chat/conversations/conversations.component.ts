import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { Socket } from 'ngx-socket-io';
import Pusher from 'pusher-js';
import { Observable, take } from 'rxjs';
import { Message } from 'src/app/models/message.model';
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
  displayConv:boolean = true
  userId?:number

  msg = new FormGroup({message: new FormControl})

  messages: Message[] = [];
  // messages:string[] = []
  
  constructor(private chatService: ChatService, private loginService:LoginService) {
    this.loginService.userId.pipe(take(1)).subscribe((id?:any) => {
      this.userId = id
    })
  }

  ngOnInit() {
    this.messages = this.conversationEmitted
    return this.chatService.getNewMessage().subscribe(data=>this.messages.push(data))
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
    this.chatService.sendNewMessage(msg)
    // this.chatService.sendMessage(msg).subscribe()
    this.msg.reset();
  }
}
