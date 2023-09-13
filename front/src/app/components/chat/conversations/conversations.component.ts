import { AfterViewChecked, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import * as _ from 'lodash';
import { Observable, take, Subscription } from 'rxjs';
import { Message } from 'src/app/models/message.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.css']
})
export class ConversationsComponent implements OnInit, OnDestroy, AfterViewChecked  {
  private subsciptions:Subscription[] = []

  @Input() userEmitted:any
  @Input() conversationEmitted:Message[] = [];
  @Input() roomConvers?:any
  @ViewChild('scrollContainer') myScrollContainer?: ElementRef;
  userId?:number
  user?:User

  msg = new FormGroup({message: new FormControl})

  messages: Message[] = [];
  roomMessage:Message[] =[]
  
  users:User[] = [];

  displayConversation:boolean = true
  lateMessage:{late:boolean, time:string, msg:Message}[] = []
  lateRoomMessage:{late:boolean, time:string, msg:Message}[] = []

  constructor(private chatService: ChatService,
    private authService: AuthService,
    ) {
    this.chatService.optionsSource.next(false)
    
    this.userId = this.authService.getLoggedInUserId();

    const subs:Subscription = chatService.displayConversation$.subscribe(data=>this.displayConversation = data)
    this.subsciptions.push(subs)
  }

  ngOnInit() {
    /////////////////////////// FOR PRIVATE MESSAGE \\\\\\\\\\\\\\\\\\\\\\\\
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
  }

  openOptions() {
    this.chatService.displayComponents(false, false, false, true, false, true, false)
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
    console.log(msg)
    if (!message) return;
    this.chatService.updateSocketId(this.userId!)
    this.chatService.sendNewMessage(msg, this.userEmitted[0])
    this.msg.reset();
  }

  sendRoomMessage() {
    const msg = {senderId:this.userId, receiverId:this.roomConvers[0].id, message:this.msg.value.message, date:new Date(), readed:false, roomId:this.roomConvers[0].id}
    if (!msg.message) return;
    this.chatService.updateSocketId(this.userId!)
    this.chatService.sendRoomMessage(this.userId!, this.roomConvers[0], msg)
    this.msg.reset();
  }

  ngAfterViewChecked() {        
    if (this.myScrollContainer) {
      this.myScrollContainer!.nativeElement.scrollTop = this.myScrollContainer?.nativeElement.scrollHeight
    }
  }

  ngOnDestroy(): void {
    this.subsciptions.forEach(sub=>sub.unsubscribe())
  }
}
