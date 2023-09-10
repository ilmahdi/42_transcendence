import { AfterViewChecked, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { Observable, take, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { Message } from 'src/app/utils/interfaces/message.model';
import { IUserData } from 'src/app/utils/interfaces/user-data.interface';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.css']
})
export class ConversationsComponent implements OnInit, OnDestroy, AfterViewChecked  {
  private subsciption1?:Subscription
  private subsciption2?:Subscription
  private subsciption3?:Subscription
  private subsciption4?:Subscription
  private subsciption5?:Subscription
  private subsciption6?:Subscription
  private subsciption7?:Subscription
  private subsciption8?:Subscription

  @Input() userEmitted:any
  @Input() conversationEmitted:Message[] = [];
  @Input() roomConvers?:any
  @ViewChild('scrollContainer') myScrollContainer?: ElementRef;
  userId?:number
  user?:IUserData

  msg = new FormGroup({message: new FormControl})

  messages: Message[] = [];
  roomMessage:Message[] =[]
  
  users:IUserData[] = [];

  displayConversation:boolean = true
  options:boolean = false
  addMember:boolean = false
  lateMessage:{late:boolean, time:string, msg:Message}[] = []
  lateRoomMessage:{late:boolean, time:string, msg:Message}[] = []

  constructor(private chatService: ChatService, private authService:AuthService) {
    this.chatService.optionsSource.next(false)
    this.subsciption1 = this.authService.userId.pipe(take(1)).subscribe((id?:any) => {
      this.userId = id;
    })

    this.subsciption2 = chatService.displayConversation$.subscribe(data=>this.displayConversation = data)
    this.subsciption3 = this.chatService.options$.subscribe(data=>this.options = data)
    this.subsciption4 = chatService.addMember$.subscribe(data=>this.addMember = data)
  }

  ngOnInit() {
    this.chatService.displayComponents(false, true, false, true, true, false, false);
    /////////////////////////// FOR PRIVATE MESSAGE \\\\\\\\\\\\\\\\\\\\\\\\
    this.subsciption5 = this.chatService.conversation$.subscribe((data)=> {
      this.messages = data

      // CHECK IF THE NEW MESSAGE IS SENT AFTER 10 MINUTES AFTER THE LAST MESSAGE
      this.lateMessage = []
      this.lateMessage = this.chatService.calculatTimeBetweenMessages(this.messages);
    })

    this.subsciption6 = this.chatService.getNewMessage().subscribe(data=>{
      this.messages.push(data)

      // CHECK IF THE NEW MESSAGE IS SENT AFTER 10 MINUTES AFTER THE LAST MESSAGE
      this.lateMessage = this.chatService.calculatTimeBetweenMessages(this.messages);
    })

    /////////////////////////// FOR ROOM MESSAGE \\\\\\\\\\\\\\\\\\\\\\\\
    this.subsciption7 = this.chatService.roomConversation$.subscribe(data=>{
      this.roomMessage = data
      this.lateRoomMessage = []
      this.lateRoomMessage = this.chatService.calculatTimeBetweenMessages(this.roomMessage);
    })
    this.subsciption8 = this.chatService.getRoomMessage().subscribe(data=>{
      this.roomMessage.push(data)
      this.lateRoomMessage = this.chatService.calculatTimeBetweenMessages(this.roomMessage);
    })
  }

  openOptions() {
    this.chatService.displayComponents(false, false, false, true, true, true, false)
  }

  getConversEvent() {
    this.chatService.displayComponents(false, false, false, false, false, false, false)
  }

  sendPrivateMessage() {
    let message = this.msg.value.message
    let senderId = this.userId
    let receiverId = this.userEmitted[0].id
    let date = new Date()
    
    const msg = {senderId, receiverId, message, date}
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
    this.subsciption1?.unsubscribe()
    this.subsciption2?.unsubscribe()
    this.subsciption3?.unsubscribe()
    this.subsciption4?.unsubscribe()
    this.subsciption5?.unsubscribe()
    this.subsciption6?.unsubscribe()
    this.subsciption7?.unsubscribe()
    this.subsciption8?.unsubscribe()
  }
}
