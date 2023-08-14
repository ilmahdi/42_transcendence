import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { BehaviorSubject, finalize, flatMap, last, map, take, tap } from 'rxjs';
import { Message } from 'src/app/models/message.model';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-direct',
  templateUrl: './direct.component.html',
  styleUrls: ['./direct.component.css']
})
export class DirectComponent implements OnInit {

  @Output() customEvent = new EventEmitter<User>();
  @Output() conversation= new EventEmitter<Message[]>();

  users:User[] = [];
  screenWidth: number = 1000;
  color:any = {color:'', name:''}

  userId?:number;
  messages: Message[] = [];

  receivedString: any[] = [];
  user?:User

  constructor(private chatService:ChatService, private loginService:LoginService) {
    this.loginService.userId.pipe(take(1)).subscribe((id?:any) => {
      this.userId = id;
    })

    loginService.user.pipe(take(1)).subscribe((data?:any) => {
      this.user = data;
    })

    this.chatService.string$.subscribe(newString => {
      this.receivedString = this.receivedString.filter(item => (item.friend !== newString.friend && item.friend.id !== this.userId));
      this.receivedString = this.receivedString.filter(item => item.friend !== this.user);
      this.receivedString.push(newString);
    });

    this.screenWidth = window.innerWidth;
    window.addEventListener('resize', this.onResize.bind(this));
  }

  ngOnInit(): void {
    console.log(this.receivedString);
    
    this.receivedString = []
    this.chatService.getUsers().subscribe((data) => {
      data.forEach((user)=>{
        if (user.id != this.userId) {
          this.users?.push(user)

        this.chatService.getLast(this.userId!, user.id!).subscribe(data=>{
          if (data.length && (data[data.length - 1].receiverId == user.id || data[data.length - 1].senderId == user.id)) {
            this.receivedString = this.receivedString.filter(message => message.friend !== user);
            this.receivedString = this.receivedString.filter(item => item.friend !== this.user);
            this.receivedString.push({friend:user, message:data[data.length - 1].message})
          }
        })
      }
    })
  });
  }

  onResize() {
    this.screenWidth = window.innerWidth;
  }

  openConversation(name:string, friend: User): void {
    //  IF THE SCREEN WIDTH < 934 SO THE CONVERSATION BUTTON COLOR WILL NOT CHANGE WHEN THE USER CLICK IT
    if (this.screenWidth > 934) {
      this.color = {color:'#D38146', name:name}
    }
    else
      this.color = {color:'', name:''}

    //  GET THE CONVERSATION FROM SERVER

    this.chatService.sendToGetConversation(this.userId!, friend.id!)
    this.chatService.getConversation().
    subscribe((data) => {
      this.messages.splice(0, this.messages.length);
      data.forEach((item)=>{
          this.messages.push(item)
      })
    })
    this.conversation.emit(this.messages);
    this.customEvent.emit(friend)
  }

}
