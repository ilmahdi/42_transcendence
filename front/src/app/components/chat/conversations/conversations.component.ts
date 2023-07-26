import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
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
  constructor(private chatService: ChatService) { }

  ngOnInit() {
    return this.chatService.getNewMessage().subscribe((message)=>{
      this.messages.push(message.text_message);
    })
  }

  getConversEvent() {
    this.getconvers.emit(true);
    this.nameEmitted[1] = false
  }

  onSubmit() {
    // let message = this.msg.value.message
    let message = {channel_id:1, text_message:this.msg.value.message, sent_at: new Date(), author:1}
    if (!message) return;
    this.chatService.sendMessage(message)
    this.msg.reset();
  }
}
