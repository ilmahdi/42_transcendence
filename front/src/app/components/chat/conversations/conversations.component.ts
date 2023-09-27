import { AfterViewChecked, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { Observable, take, Subscription } from 'rxjs';
import { Message } from 'src/app/models/message.model';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { UserService } from 'src/app/services/user.service';
import { IUserDataShort } from 'src/app/utils/interfaces/user-data.interface';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.css']
})
export class ConversationsComponent implements OnInit, OnDestroy, AfterViewChecked  {
  private subsciptions:Subscription[] = []

  @Input() userEmitted:any
  @Input() roomConvers?:any
  @ViewChild('scrollContainer') myScrollContainer?: ElementRef;
  userId?:number
  user?:IUserDataShort

  msg = new FormGroup({message: new FormControl})

  messages: Message[] = [];
  roomMessage:Message[] =[]
  
  users:IUserDataShort[] = [];

  displayConversation:boolean = true
  lateMessage:{late:boolean, time:string, msg:Message}[] = []
  lateRoomMessage:{late:boolean, time:string, msg:Message}[] = []

  constructor(private chatService: ChatService,
    private authService: AuthService,
    private userService:UserService,
    private router:Router
    ) {
    this.chatService.optionsSource.next(false)
    
    this.userId = this.authService.getLoggedInUserId();

    const subs1:Subscription = chatService.displayConversation$.subscribe(data=>this.displayConversation = data)
    this.subsciptions.push(subs1)
  }

  ngOnInit() {
    /////////////////////////// FOR PRIVATE MESSAGE \\\\\\\\\\\\\\\\\\\\\\\\
    const subs10:Subscription = this.chatService.getConversation().subscribe((data) => {
      data.sort((a:Message, b:Message)=>a.id! - b.id!)
      this.chatService.updateConversation(data);
    })
    const subs1:Subscription = this.chatService.conversation$.subscribe((data)=> {
      this.messages = data

      // CHECK IF THE NEW MESSAGE IS SENT AFTER 10 MINUTES AFTER THE LAST MESSAGE
      this.lateMessage = []
      this.lateMessage = this.chatService.calculatTimeBetweenMessages(this.messages);
    })
    this.subsciptions.push(subs1)

    const subs2:Subscription = this.chatService.getNewMessage().subscribe(data=>{
      this.messages.push(data)

      // CHECK IF THE NEW MESSAGE IS SENT AFTER 10 MINUTES AFTER THE LAST MESSAGE
      this.lateMessage = this.chatService.calculatTimeBetweenMessages(this.messages);
    })
    this.subsciptions.push(subs2)

    /////////////////////////// FOR ROOM MESSAGE \\\\\\\\\\\\\\\\\\\\\\\\
    const subs:Subscription = this.chatService.getRoomConversation().subscribe((data) => {
      data.sort((a:Message, b:Message)=>a.id! - b.id!)
      this.chatService.updateRoomConversation(data);
    })
    const subs3:Subscription = this.chatService.roomConversation$.subscribe(data=>{
      this.roomMessage = data
      this.lateRoomMessage = []
      this.lateRoomMessage = this.chatService.calculatTimeBetweenMessages(this.roomMessage);
    })
    this.subsciptions.push(subs3)

    const subs4:Subscription = this.chatService.getRoomMessage().subscribe(data=>{
      this.roomMessage.push(data)
      this.lateRoomMessage = this.chatService.calculatTimeBetweenMessages(this.roomMessage);
    })
    this.subsciptions.push(subs4)

    if (this.roomConvers.length) {
      this.chatService.sendToGetRoomMembers(this.roomConvers[0]);
      this.chatService.getRoomMembers().subscribe(data=>{
        this.users = []
        data.forEach(member=>this.users.push(member.user));
      })
    }
  }

  openOptions() {
    this.chatService.displayComponents(false, false, false, true, false, true, false)
  }

  goPlay() {
    this.router.navigateByUrl('/profile/' + this.userEmitted[0].username)
  }

  getConversEvent() {
    this.chatService.displayComponents(false, false, false, false, true, false, false)
  }

  sendPrivateMessage() {
    let message = this.msg.value.message
    let senderId = this.userId
    let receiverId = this.userEmitted[0].id
    let date = new Date()
    
    const msg = {senderId, receiverId, message, date}
    if (!message) return;

    const subs:Subscription = this.chatService.getUsers().subscribe(friends=>{
      friends.forEach(friend=>{
        if (friend.id === this.userEmitted[0].id && friend.username === this.userEmitted[0].username) {
          this.chatService.sendNewMessage(msg, this.userEmitted[0])
          this.msg.reset();
          return;
        }
      })
    })
    this.subsciptions.push(subs);
    this.msg.reset();
  }

  sendRoomMessage() {
    const msg = {senderId:this.userId,
      receiverId:this.userId,
      message:this.msg.value.message,
      date:new Date(), 
      readed:false,
      roomId:this.roomConvers[0].id,
      mutes:this.roomConvers[0].mutes}   
    if (!msg.message) return;
    this.chatService.sendToGetRoomMembers(this.roomConvers[0])
    const subs1:Subscription = this.chatService.getRoomMembers().pipe(take(1)).subscribe(data=> {
      let found:boolean = false
      data.forEach(item=>{
        if (item.user.id === this.userId) {
          found = true
        }
      })
      if (found) {
        // UPDATE ROOM
        this.chatService.sendToGetRoomById(this.roomConvers[0].id);
        const subs2:Subscription = this.chatService.getRoomById().pipe(take(1)).subscribe(room=> {
          this.chatService.sendRoomMessage(this.userId!, room, msg);
          this.msg.reset();
        })
        this.subsciptions.push(subs2);
      }
      else
        this.chatService.displayComponents(false, false, false, true, true, false, false);
    })
    this.subsciptions.push(subs1)
    this.msg.reset();
  }

  ngAfterViewChecked() {        
    if (this.myScrollContainer) {
      this.myScrollContainer!.nativeElement.scrollTop = this.myScrollContainer?.nativeElement.scrollHeight
    }
  }

  bannedUser(message:Message) {
    if (!this.roomConvers[0].usersId.includes(message.senderId))
      return true
    return false;
  }

  clickOnConversation() {
    this.chatService.clickOnConversationSource.next({click:true, user:this.userEmitted[0]})
  }

  openProfile(user:IUserDataShort) {
    this.router.navigateByUrl('/profile/' + user.username)
  }

  ngOnDestroy(): void {
    this.subsciptions.forEach(sub=>sub.unsubscribe())
  }
}
