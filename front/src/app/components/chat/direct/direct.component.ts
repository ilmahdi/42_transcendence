import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { BehaviorSubject, Subscription, finalize, flatMap, last, map, take, tap } from 'rxjs';
import { ConversationsComponent } from '../conversations/conversations.component';
import { IUserData } from 'src/app/utils/interfaces/user-data.interface';
import { Message } from 'src/app/utils/interfaces/message.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-direct',
  templateUrl: './direct.component.html',
  styleUrls: ['./direct.component.css']
})
export class DirectComponent implements OnInit, OnDestroy {

  @Output() customEvent = new EventEmitter<IUserData>();
  @Output() conversation= new EventEmitter<Message[]>();

  private subscription0?: Subscription
  private subscription1?: Subscription
  private subscription2?: Subscription
  private subscription3?: Subscription
  private subscription4?: Subscription
  private subscription5?: Subscription
  private subscription6?: Subscription
  private subscription7?: Subscription
  private subscription8?: Subscription
  private subscription9?: Subscription
  private subscription10?: Subscription
  private subscription11?: Subscription

  users:IUserData[] = [];
  screenWidth: number = 1000;
  color:any = {color:'', name:''}

  userId?:number;
  messages: Message[] = [];

  lastMessages: any[] = [];

  notReaded:{ senderId: number; unreadCount: number }[] = []
  readSymbol:{senderId:number, receiverId:number, read:boolean}[] = []
  constructor(private chatService:ChatService, private authService:AuthService) {
    this.subscription0 = this.authService.userId.pipe(take(1)).subscribe((id?:any) => {
      this.userId = id;
    })

    this.screenWidth = window.innerWidth;
    window.addEventListener('resize', this.onResize.bind(this));

    // GET THE NUMBER OF MESSAGES WHICH ARE NOT HAVE READ BY YOU WITH THE SENDER ID
    this.subscription1 = this.chatService.getNewMessage().subscribe(data1=>{
      this.chatService.updateLastMessage(data1);
      this.subscription2 = chatService.getNotReadedMessages().subscribe(data=>{
        chatService.updateReadBehav(data);
      })
    })

    this.subscription3 = chatService.string$.subscribe(data=>{
      // GET THE NEW UNREAD MESSAGE AND ADD IT IN readSymbolSource WITH FALSE READ SIGNAL
      let item = {senderId:data.senderId, receiverId:data.receiverId, read:false}
      let newArray:{senderId:number, receiverId:number, read:boolean}[] = chatService.readSymbolSource.getValue()
      newArray = newArray.filter(data1=>data1.receiverId !== item.receiverId && !((data1.receiverId === data.receiverId && data1.senderId === data.senderId) || (data1.senderId === data.receiverId && data1.receiverId === data.senderId)))
      newArray.push(item)
      chatService.readSymbolSource.next(newArray)

      this.lastMessages = this.lastMessages.filter(item => !((item.receiverId === data.receiverId && item.senderId === data.senderId) || (item.senderId === data.receiverId && item.receiverId === data.senderId)));
      this.lastMessages.push(data)
      // IF YOU EALREADY HAVE AN UNREADED MESSAGE FROM THE SENDERID OR IF NO (else)
      if (this.notReaded.some(item => item.senderId === data.senderId)) {
        this.notReaded.map(item=> {
          if (item.senderId === data.senderId) {
            item.unreadCount++;
          }
        })
      }
      else {
        this.notReaded.push({senderId:data.senderId, unreadCount:1})
      }
    })

    // CHANGE THE READ SYMBOLE WHICH MEAN THAT THE USER HAVE READ YOUR MESSAGES
    this.subscription4 = chatService.getReadSignal().subscribe(bool=>{
      let item = {senderId:this.lastMessages[this.lastMessages.length - 1].senderId, receiverId:this.lastMessages[this.lastMessages.length - 1].receiverId, read:false}
      let newArray:{senderId:number, receiverId:number, read:boolean}[] = chatService.readSymbolSource.getValue()
      if (this.readSymbol.includes({senderId:this.lastMessages[this.lastMessages.length - 1].senderId, receiverId:this.lastMessages[this.lastMessages.length - 1].receiverId, read:false}))
        newArray = newArray.filter(data=>data !== item)
        newArray = newArray.filter(data=>data.receiverId !== item.receiverId)
      newArray.push(item)
      newArray.forEach(item=>{
        if (bool === true) {
          item.read = true
        }
      })
      chatService.readSymbolSource.next(newArray);
    })
    this.subscription5 = chatService.readSymbol$.subscribe(data=> {this.readSymbol = data})
  }

  ngOnInit(): void {
    this.subscription6 = this.chatService.getUsers().subscribe((data) => {
      this.users = []
      data.forEach((user)=>{
        if (user.id != this.userId) {
          this.users?.push(user);
        }
      })
      this.chatService.updateUsers(this.users)
    });

    this.subscription7 = this.chatService.users$.subscribe(data=> {
      this.users = data;
    })

    this.chatService.sendToGetNotReadedMessages(this.userId!)//////////
    this.subscription8 = this.chatService.notReadedMessage$.subscribe(data=>{
      this.notReaded = [];
      data.forEach(item=>this.notReaded.push(item));
    })

    this.chatService.sendToGetLastMessage(this.userId!)
    this.subscription9 = this.chatService.getLastMessage().subscribe(data=> {
      data.sort((a:Message, b:Message)=>a.id! - b.id!)
      data.forEach(data=> {
        this.lastMessages = this.lastMessages.filter(item => !((item.receiverId === data.receiverId && item.senderId === data.senderId) || (item.senderId === data.receiverId && item.receiverId === data.senderId)));
        this.lastMessages.push(data)

        // INITIALIZATION OF readSymbol WHEN USER JUST ENTER TO CHAT PAGE
        if (data.senderId) {
          this.readSymbol = this.readSymbol.filter(item=> !((item.receiverId === data.receiverId && item.senderId === data.senderId) || (item.senderId === data.receiverId && item.receiverId === data.senderId)))
          this.readSymbol.push({senderId:data.senderId!, receiverId:data.receiverId!, read:data.readed!})
        }
      })
    })
  }

  onResize() {
    this.screenWidth = window.innerWidth;
  }

  openConversation(name:string, friend: IUserData): void {
    //  IF THE SCREEN WIDTH < 934 SO THE CONVERSATION BUTTON COLOR WILL NOT CHANGE WHEN THE USER CLICK IT
    if (this.screenWidth > 934) {
      this.color = {color:'#d3814674', name:name}
    }
    else
      this.color = {color:'', name:''}

    //  GET THE CONVERSATION FROM SERVER
    this.chatService.sendToGetConversation(this.userId!, friend.id!)
    this.subscription10 = this.chatService.getConversation().subscribe((data) => {
      data.sort((a:Message, b:Message)=>a.id! - b.id!)
      this.chatService.updateConversation(data);
      this.messages.splice(0, this.messages.length);
      data.forEach((item)=>{
        this.messages.push(item);
        if (item.senderId !== this.userId) {
          this.chatService.updateRead(item);
          this.chatService.updateReadBehav(this.notReaded.filter(shit=> shit.senderId !== item.senderId));
        }
      })
    })
    this.chatService.roomFormular(false);
    this.subscription11 = this.chatService.getNotReadedMessages().subscribe(data=>{
      this.chatService.updateReadBehav(data);
    })

    // SEND A SIGNAL WICH INDICATE THAT THE USER HAVE READ THE MESSAGES
    if (this.lastMessages[this.lastMessages.length -1].receiverId === this.userId)
      this.chatService.sendReadSignal();

    this.chatService.displayComponents(false, true, false, true, true, false, false);
    this.customEvent.emit(friend)
  }

  editeDateFormat(date:Date) {
    const newDate = new Date(date)
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',   // Two-digit day
      month: '2-digit', // Two-digit month
      year: 'numeric'   // Full year
    };
    
    const formattedDate: string = newDate.toLocaleDateString('en-GB', options);
    return formattedDate
  }

  ngOnDestroy(): void {
    this.messages = []
    this.chatService.updateUsers([])

    this.subscription0?.unsubscribe()
    this.subscription1?.unsubscribe()
    this.subscription2?.unsubscribe()
    this.subscription3?.unsubscribe()
    this.subscription4?.unsubscribe()
    this.subscription5?.unsubscribe()
    this.subscription6?.unsubscribe()
    this.subscription7?.unsubscribe()
    this.subscription8?.unsubscribe()
    this.subscription9?.unsubscribe()
    this.subscription10?.unsubscribe()
    this.subscription11?.unsubscribe()
  }
}
