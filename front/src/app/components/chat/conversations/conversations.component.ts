import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Conversation } from 'src/app/models/Conversation';
import { User } from 'src/app/models/user.model';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.css']
})
export class ConversationsComponent implements OnInit {

  @Input() nameEmitted:any = {name:'', displayConv: true}
  @Output() getconvers = new EventEmitter<boolean>()
  displayConv:boolean = true

  newMessage$?: Observable<string>
  messages: any[] = []
  msg = new FormGroup({message: new FormControl})

  conversations$?: Observable<Conversation[]>;
  conversations: Conversation[] = [];
  conversation?: Conversation;
  userId?: number;
  
  constructor(private chatService: ChatService) { }

  ngOnInit() {
    return this.chatService.getNewMessage().subscribe((message)=>{
      this.messages.push(message.message);
    })
  }

  getConversEvent() {
    this.getconvers.emit(true);
    this.nameEmitted[1] = false;
  }

  onSubmit() {
    const { message } = this.msg.value;
    if (!message) return;
    
    let conversationUserIds = [this.userId, this.chatService.friend?.id].sort();

    this.conversations.forEach((conversation: Conversation) => {
      let userIds = conversation.users?.map((user: User) => user.id).sort();

      if (JSON.stringify(conversationUserIds) === JSON.stringify(userIds)) {
        this.conversation = conversation;
      }
    });
    console.log(this.conversation);
    
    this.chatService.sendMessage(message, this.conversation!);
    this.msg.reset();
  }
}
