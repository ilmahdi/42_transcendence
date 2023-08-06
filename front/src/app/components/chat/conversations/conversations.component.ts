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

  @Input() nameEmitted:any = {name:'', displayConv: true}
  @Output() getconvers = new EventEmitter<boolean>()
  displayConv:boolean = true
  username?:string

  msg = new FormGroup({message: new FormControl})

  recipientUserId: string = ''; // Set the recipient user ID
  messages: any[] = [];
  
  constructor(private chatService: ChatService, private loginService:LoginService) {
    this.loginService.username.pipe(take(1)).subscribe((username?:any) => {
      this.username = username
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
    
    this.chatService.getMessages().subscribe((data) => {
      this.messages = data;
    })
  }

  getConversEvent() {
    this.getconvers.emit(true);
    this.nameEmitted[1] = false;
  }

  onSubmit() {
    let message = this.msg.value.message
    let username = this.username
    const mmm = {username, message}
    this.chatService.sendMessage(mmm).subscribe()
    this.msg.reset();
  }
}
