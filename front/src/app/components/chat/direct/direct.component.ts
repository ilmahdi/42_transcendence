import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { BehaviorSubject } from 'rxjs';
import { Message } from 'src/app/models/message.model';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-direct',
  templateUrl: './direct.component.html',
  styleUrls: ['./direct.component.css']
})
export class DirectComponent implements OnInit {

  @Output() customEvent = new EventEmitter<string>();
  n:any[] = [
    {id:1, name:'saad', message: 'lets play a game', readed: true, date: '03/02/2022'},
    {id:2, name:'ismail', message:'lets play a game', readed: false, date: '03/02/2022'},
    {id:3, name:'omar', message:'lets play a game', readed: true, date: '03/02/2022'}
  ];
  screenWidth: number = 1000;
  color:any = {color:'', name:''} 

  constructor(private chatService:ChatService) {
    this.screenWidth = window.innerWidth;
    window.addEventListener('resize', this.onResize.bind(this));
  }

  ngOnInit(): void {
  }

  onResize() {
    this.screenWidth = window.innerWidth;
  }

  emitEvent(name:string) {
    if (this.screenWidth > 934) {
      this.color = {color:'#D38146', name:name}
    }
    else
      this.color = {color:'', name:''}
    this.customEvent.emit(name)
  }

  openConversation(name:string, friend: User, index: number): void {
    if (this.screenWidth > 934) {
      this.color = {color:'#D38146', name:name}
    }
    else
      this.color = {color:'', name:''}
    this.customEvent.emit(name)
    
    this.chatService.selectedConversationIndex = index;


    this.chatService.friend = friend;
    this.chatService.friend$?.next(this.chatService.friend);

    this.chatService.messages = [];
  }

}
