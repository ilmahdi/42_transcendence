import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { Subscription, take } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { Room } from 'src/app/models/room.model';
import { IUserDataShort } from 'src/app/utils/interfaces/user-data.interface';
import { AuthService } from 'src/app/services/auth.service';
import { Message } from 'src/app/models/message.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  private subscriptions:Subscription[] = []

  room = new FormGroup({name: new FormControl, imagePath: new FormControl})

  userEvent:any[] = []
  roomData:any[] = []

  directClicked: boolean = true
  roomsClicked: boolean = false
  screenWidth: number = 1000;
  displayConvers:boolean = false;
  options:boolean = false
  addMember:boolean = false
  otherRooms:boolean = false
  conversation:boolean = false

  userId?:number
  addRoom:boolean = false

  searchQuery: string = '';
  searchResults: IUserDataShort[] = [];
  constructor(
    private chatService:ChatService, 
    private authService: AuthService,
    ) {

    this.userId = this.authService.getLoggedInUserId();

    this.screenWidth = window.innerWidth;
    window.addEventListener('resize', this.onResize.bind(this));

    chatService.sendToGetLastMessage(this.userId!)
    chatService.sendToGetRoomLastMessage(this.userId!)

    const subs:Subscription = chatService.getNotReadedRoomMessages().subscribe(data=>{
      chatService.updateReadRoomBehav(data)
    })
    this.subscriptions.push(subs)

    chatService.displayComponents(false, false, false, false, true, false, false);
  }

  ngOnInit(): void {
    
    const subs1:Subscription = this.chatService.displayConvers$.subscribe(data=> {
      this.displayConvers = data
    })
    this.subscriptions.push(subs1)

    const subs2:Subscription = this.chatService.options$.subscribe(data=>this.options = data)
    this.subscriptions.push(subs2)

    const subs3:Subscription = this.chatService.addMember$.subscribe(data=>this.addMember = data)
    this.subscriptions.push(subs3)

    const subs4:Subscription = this.chatService.displayOtherRooms$.subscribe(data=>this.otherRooms = data)
    this.subscriptions.push(subs4)

    const subs5:Subscription = this.chatService.displayConversation$.subscribe(data=>this.conversation = data)
    this.subscriptions.push(subs5)
  }

  onResize() {
    this.screenWidth = window.innerWidth;
  }

  onDirect() {
    this.directClicked = true;
    this.roomsClicked = false;
  }

  onRooms() {
    this.roomsClicked = true;
    this.directClicked = false;
  }

  onCustomEvent(user:IUserDataShort) {
    this.userEvent = [user, true]
    this.roomData = []
  }

  displayFormRoom() {
    const subs:Subscription = this.chatService.add$.subscribe(data=>this.addRoom = data)
    this.subscriptions.push(subs)
    this.chatService.displayComponents(true, false, false, true, false, false, false)
  }

  getRoomConvers(room:Room) {
    this.chatService.sendToGetRoomById(room.id!)

    this.chatService.getRoomById().pipe(take(1)).subscribe(actualRoom=> {
      this.chatService.sendToGetRoomConversation(actualRoom)
      const subs:Subscription = this.chatService.getRoomConversation().subscribe((data) => {
        data.sort((a:Message, b:Message)=>a.id! - b.id!)
        this.chatService.updateRoomConversation(data);
        this.chatService.displayComponents(false, true, false, true, false, false, false);
      })
      this.subscriptions.push(subs)
      this.chatService.roomOptionsSource.next(actualRoom);////////////
    
      this.roomData = [actualRoom, true]
    })
  }

  searchQueryConvers() {
    const subs:Subscription = this.chatService.searchConvers(this.searchQuery).subscribe(data=>{
      this.chatService.updateUsers(data)
    })
    this.subscriptions.push(subs)
  }

  searchQueryRooms() {
    const subs:Subscription = this.chatService.searchRooms(this.searchQuery).subscribe(data=>{
      this.searchResults = []
      data.forEach(room=> {
        if (room.usersId?.includes(this.userId!))
          this.searchResults.push(room)
      })
      this.chatService.updateRooms(this.searchResults)
    })
    this.subscriptions.push(subs)
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>sub.unsubscribe())
  } 
}
