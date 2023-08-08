import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
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

  messages: any[] = [];
  
  constructor(private chatService: ChatService, private loginService:LoginService) {
    this.loginService.userId.pipe(take(1)).subscribe((id?:any) => {
      this.userId = id
    })
  }

  ngOnInit() {
    Pusher.logToConsole = true;

    const pusher = new Pusher('a7ecfcc0f67ed4def5ba', {
      cluster: 'eu'
    });

    const channel = pusher.subscribe('chat');
    channel.bind('message', (data: Message) => {
      this.messages.push(data);
    });
    this.messages = this.conversationEmitted
  }

  getConversEvent() {
    this.getconvers.emit(true);
    this.userEmitted[1] = false;
  }

  onSubmit() {
    let rec = this.userEmitted[0]
    let message = this.msg.value.message
    let senderId = this.userId
    let receiverId = rec.id
    
    const msg = {senderId, receiverId, message}
    this.chatService.sendMessage(msg).subscribe()
    this.msg.reset();
  }
}
