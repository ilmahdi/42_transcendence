import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.css']
})
export class ConversationsComponent implements OnInit {

  @Input() nameEmitted?:string

  newMessage$?: Observable<string>
  messages: string[] = []
  msg = new FormGroup({message: new FormControl})
  constructor(private chatService: ChatService) { }

  ngOnInit() {
    return this.chatService.getNewMessage().subscribe((message:string)=>{
      this.messages.push(message);
    })
  }

  onSubmit() {
    let message = this.msg.value.message
    if (!message) return;
    this.chatService.sendMessage(message)
    this.msg.reset();
  }
}
