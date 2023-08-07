import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { BehaviorSubject } from 'rxjs';
import { Message } from 'src/app/models/message.model';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-direct',
  templateUrl: './direct.component.html',
  styleUrls: ['./direct.component.css']
})
export class DirectComponent implements OnInit {

  @Output() customEvent = new EventEmitter<User>();
  // @Output() conversation= new EventEmitter<any>();

  users?:any[];
  screenWidth: number = 1000;
  color:any = {color:'', name:''}

  // userId?:number

  constructor(private chatService:ChatService, private router:Router) {
    this.screenWidth = window.innerWidth;
    window.addEventListener('resize', this.onResize.bind(this));
  }

  ngOnInit(): void {
    this.chatService.getUsers().subscribe((data) => {
      this.users = data;
    });
  }

  onResize() {
    this.screenWidth = window.innerWidth;
  }

  openConversation(name:string, friend: User, index: number): void {
    if (this.screenWidth > 934) {
      this.color = {color:'#D38146', name:name}
    }
    else
      this.color = {color:'', name:''}
    this.customEvent.emit(friend)
  }

}
