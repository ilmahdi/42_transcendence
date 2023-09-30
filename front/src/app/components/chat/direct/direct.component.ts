import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { Subscription } from 'rxjs';
import { Message } from 'src/app/models/message.model';
import { UserService } from 'src/app/services/user.service';
import { IUserData, IUserDataShort } from 'src/app/utils/interfaces/user-data.interface';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-direct',
  templateUrl: './direct.component.html',
  styleUrls: ['./direct.component.css']
})
export class DirectComponent implements OnInit, OnDestroy {

  @Output() customEvent = new EventEmitter<IUserDataShort>();

  private subscriptions: Subscription[] = []

  users:IUserDataShort[] = [];
  screenWidth: number = 1000;
  color:any = {color:'', name:''}

  userId?:number;

  lastMessages: any[] = [];

  notReaded:{ senderId: number; unreadCount: number }[] = []
  readSymbol:{senderId:number, receiverId:number, read:boolean}[] = []
  constructor(
    private chatService:ChatService, 
    private userService: UserService,
    private authService: AuthService,
    ) {
      this.userId = this.authService.getLoggedInUserId();
    

    this.screenWidth = window.innerWidth;
    window.addEventListener('resize', this.onResize.bind(this));

    // GET THE NUMBER OF MESSAGES WHICH ARE NOT HAVE READ BY YOU WITH THE SENDER ID
    const subs1:Subscription = this.chatService.getNewMessage().subscribe(data1=>{
      // IF I USER SEND OR RECEIVE A MESSAGE FROM AN USER NOT A FRIEND
      this.getActualConvers(data1)
      this.sortConversations(data1)

      // CLEAR CHAT NOTIFICATION
      this.chatService.chatNotifSource.next(0);

      this.chatService.updateLastMessage(data1);
      const subs2:Subscription = chatService.getNotReadedMessages().subscribe(data=>{
        chatService.updateReadBehav(data);
      })
      this.subscriptions.push(subs2)
    })
    this.subscriptions.push(subs1)

    const subs3:Subscription = chatService.string$.subscribe(data=>{
      // GET THE NEW UNREAD MESSAGE AND ADD IT IN readSymbolSource WITH FALSE READ SIGNAL
      let item = {senderId:data.senderId!, receiverId:data.receiverId!, read:false}
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
        this.notReaded.push({senderId:data.senderId!, unreadCount:1})
      }
    })
    this.subscriptions.push(subs3)

    // CHANGE THE READ SYMBOLE WHICH MEAN THAT THE USER HAVE READ YOUR MESSAGES
    const subs4:Subscription = chatService.getReadSignal().subscribe(data=>{
      let item = {senderId:this.userId!, receiverId:data.receiver, read:false}
      let newArray:{senderId:number, receiverId:number, read:boolean}[] = chatService.readSymbolSource.getValue()
      if (this.readSymbol.includes({senderId:this.userId!, receiverId:data.receiver, read:false})) {
        newArray = newArray.filter(data=>data !== item)
        newArray = newArray.filter(data=>data.receiverId !== item.receiverId)
      }
      newArray = newArray.filter(item2=> item2.senderId != item.senderId && item2.receiverId != item.receiverId)

      newArray.push(item)
      newArray.forEach(item=>{
        if (data.read === true)
          item.read = true
      })
      chatService.readSymbolSource.next(newArray);
    })
    this.subscriptions.push(subs4)
    const subs5:Subscription = chatService.readSymbol$.subscribe(data=> {this.readSymbol = data})
    this.subscriptions.push(subs5)
  }

  ngOnInit(): void {
    this.getAllConversations()

    const subs1:Subscription = this.chatService.users$.subscribe(data=> {
      this.users = [];
      this.users = data
    })
    this.subscriptions.push(subs1)

    this.chatService.sendToGetNotReadedMessages(this.userId!)//////////
    const subs2:Subscription = this.chatService.notReadedMessage$.subscribe(data=>{
      this.notReaded = [];
      data.forEach(item=>this.notReaded.push(item));
    })
    this.subscriptions.push(subs2)

    this.chatService.sendToGetLastMessage(this.userId!)
    const subs3:Subscription = this.chatService.getLastMessage().subscribe(data=> {
      // CLEAR CHAT NOTIFICATION
      this.chatService.chatNotifSource.next(0);

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
    this.subscriptions.push(subs3)

    // CHECK IF THE YOUR FRIEND HAS CLICKED ON YOUR CONVERSATION, IF TRUE THAT IS MEAN HE READ YOUR MESSAGE
    const subs4:Subscription = this.chatService.clickOnConversation$.subscribe(data=>{
      if (data.click) {
        this.openConversation(data.user, false)
        this.chatService.clickOnConversationSource.next({click:false, user:data.user});
      }
    })
    this.subscriptions.push(subs4)
  }

  onResize() {
    this.screenWidth = window.innerWidth;
  }

  openConversation(friend: IUserDataShort, flag:boolean): void {
    //  IF THE SCREEN WIDTH < 1350 SO THE CONVERSATION BUTTON COLOR WILL NOT CHANGE WHEN THE USER CLICK IT
    if (this.screenWidth > 1350) {
      this.color = {color:'#d3814674', name:friend.username}
    }
    else
    this.color = {color:'', name:''}
  
    //  GET THE CONVERSATION FROM SERVER
    this.chatService.sendToGetConversation(this.userId!, friend.id!)
    const subs1:Subscription = this.chatService.getConversation().subscribe((data) => {
      data.sort((a:Message, b:Message)=>a.id! - b.id!)
      this.chatService.updateConversation(data);
      data.forEach((item)=>{
        if (item.senderId !== this.userId) {
          this.chatService.updateRead(item);
          this.chatService.updateReadBehav(this.notReaded.filter(shit=> shit.senderId !== item.senderId));
        }
      })
      if (flag) // HIDE EVERY COMPONENT AND OPEN CONVERSATION COMPONENT 
        this.chatService.displayComponents(false, true, false, true, false, false, false);
      })
      this.subscriptions.push(subs1)
      const subs2:Subscription = this.chatService.getNotReadedMessages().subscribe(data=>{
      this.chatService.updateReadBehav(data);
    })
    this.subscriptions.push(subs2)

    // SEND A SIGNAL WICH INDICATE THAT THE USER HAVE READ THE MESSAGES
    let receiver:Message = {};
    this.lastMessages.forEach(msg=> {
      if (msg.senderId === friend.id && msg.receiverId === this.userId)
        receiver = msg
    })
    this.chatService.sendReadSignal(receiver.senderId!, receiver.receiverId!);

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

  getfriendList() {
    const subs:Subscription = this.userService.getfriendList(this.userId!).subscribe({
     next: (response :IUserDataShort[]) => {
      
      this.chatService.updateUsers(response)
     },
     error: error => {
       console.error('Error:', error.error.message); 
     }
   });
   this.subscriptions.push(subs)
  }

  sortConversations(message:Message) {
    let newList:IUserDataShort[] = []
    if (message.senderId === this.userId) {
      const user:IUserDataShort = this.users.filter(item=> item.id === message.receiverId)[0];
      newList.push(user);
      this.users.forEach(item=> {
        if (item.id !== message.receiverId)
          newList.push(item)
      })
      this.chatService.usersSource.next(newList)
    }
    else {
      const user:IUserDataShort = this.users.filter(item=> item.id === message.senderId)[0];
      newList.push(user);
      this.users.forEach(item=> {
        if (item.id !== message.senderId)
          newList.push(item)
      })
      this.chatService.usersSource.next(newList)
    }
  }

  getAllConversations() {
    this.chatService.sendToGetAllConversations(this.userId!);
    this.chatService.getAllConversations().subscribe(data=> {
      let users:IUserDataShort[] = this.chatService.usersSource.value.concat(data);
      let actualUsers:IUserDataShort[] = []
      users.forEach(item=> {
        actualUsers = actualUsers.filter(user=> user.id !== item.id)
        actualUsers.push(item);
      })

      let sortedUsers:IUserDataShort[] = []
      this.lastMessages.sort((a:Message, b:Message)=> b.id! - a.id!)
      this.lastMessages.forEach(message=> {
        if (message.senderId === this.userId) {
          let user:IUserDataShort = actualUsers.filter(item=> item.id === message.receiverId)[0]
          if (user && user.id != this.userId)
            sortedUsers.push(user);
        }
        else {
          let user:IUserDataShort = actualUsers.filter(item=> item.id === message.senderId)[0]
          if (user && user.id != this.userId)
            sortedUsers.push(user);
        }
      })
      
      if (sortedUsers.length === actualUsers.length) {
        this.users = sortedUsers
        this.chatService.updateUsers(sortedUsers);
      }
      else {
        if (sortedUsers.length) {
          sortedUsers.forEach(user=> actualUsers = actualUsers.filter(item=> item.id !== user.id && item.id !== this.userId))
          this.users = sortedUsers
          this.users = this.users.concat(actualUsers)
          this.chatService.updateUsers(this.users);
        }
        else {
          this.users = actualUsers
          this.chatService.updateUsers(actualUsers);
        }
      }
    })
  }

  getActualConvers(msg:Message) {
    let send:boolean = true;
    this.chatService.usersSource.value.forEach(user=> {
      if (user.id === msg.sender!.id) {
        send = false
      }
    })
    if (send)
      this.chatService.updateUsers(this.chatService.usersSource.value.concat(msg.sender!));
  }

  ngOnDestroy(): void {
    this.chatService.updateUsers([])

    this.subscriptions.forEach(sub=>sub.unsubscribe())
  }
}
