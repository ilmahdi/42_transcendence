import { Component, OnInit, OnDestroy } from '@angular/core';
import { Message } from 'src/app/models/message.model';
import { User } from 'src/app/models/user.model';
import { ChatService } from 'src/app/services/chat.service';
import { Subscription, firstValueFrom, take } from 'rxjs';
import * as _ from 'lodash';
import { FormControl, FormGroup } from '@angular/forms';
import { Room } from 'src/app/models/room.model';
import { UserService } from 'src/app/services/user.service';
import { IUserDataShort } from 'src/app/utils/interfaces/user-data.interface';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  private subscription1?:Subscription
  private subscription2?:Subscription
  private subscription3?:Subscription
  private subscription4?:Subscription
  private subscription5?:Subscription
  private subscription6?:Subscription
  private subscription7?:Subscription
  private subscription8?:Subscription
  private subscription9?:Subscription

  room = new FormGroup({name: new FormControl, imagePath: new FormControl})

  userEvent:any[] = []
  conversationEvent!:Message[];
  roomData:any[] = []

  directClicked: boolean = true
  roomsClicked: boolean = false
  screenWidth: number = 1000;
  smallScreen:boolean = false;
  displayConvers:boolean = false;
  options:boolean = false
  addMember:boolean = false

  userId?:number
  addRoom:boolean = false

  searchQuery: string = '';
  searchResults: IUserDataShort[] = [];
  roomFormular:any = {}
  constructor(
    private chatService:ChatService, 
    private userService: UserService,
    private authService: AuthService,
    ) {

    this.userId = this.authService.getLoggedInUserId();

    this.screenWidth = window.innerWidth;
    window.addEventListener('resize', this.onResize.bind(this));

  
    chatService.sendToGetLastMessage(this.userId!)
    chatService.sendToGetRoomLastMessage(this.userId!)

    // chatService.sendToGetNotReadedRoomMessages(this.userId!);
    this.subscription2 = chatService.getNotReadedRoomMessages().subscribe(data=>{
      chatService.updateReadRoomBehav(data)
    })
  }

  ngOnInit(): void {
    
    this.subscription5 = this.chatService.displayConvers$.subscribe(data=> this.displayConvers = data)

    this.chatService.options$.subscribe(data=>this.options = data)

    this.chatService.addMember$.subscribe(data=>this.addMember = data)
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
    this.smallScreen = true
    this.userEvent = [user, true]
    this.roomData = []
  }

  getConversation(data:Message[]) {
    this.conversationEvent = data;
  }

  displayFormRoom() {
    this.subscription6 = this.chatService.add$.subscribe(data=>this.addRoom = data)
    this.chatService.displayComponents(true, false, false, true, false, false, false)
  }

  getRoomConvers(room:Room) {
    this.smallScreen = true
    this.displayConvers = false
    this.chatService.sendToGetRoomById(room.id!)
    this.roomData = [room, true]
  }

  searchQueryConvers() {
    this.subscription8 = this.chatService.searchConvers(this.searchQuery).subscribe(data=>{
      this.searchResults = data
      this.chatService.updateUsers(data)
    })
  }

  searchQueryRooms() {
    this.subscription9 = this.chatService.searchRooms(this.searchQuery).subscribe(data=>{
      this.searchResults = []
      data.forEach(room=> {
        if (room.usersId?.includes(this.userId!))
          this.searchResults.push(room)
      })
      this.chatService.updateRooms(this.searchResults)
    })
  }

  ngOnDestroy(): void {
    this.subscription1?.unsubscribe()
    this.subscription2?.unsubscribe()
    this.subscription3?.unsubscribe()
    this.subscription4?.unsubscribe()
    this.subscription5?.unsubscribe()
    this.subscription6?.unsubscribe()
    this.subscription7?.unsubscribe()
    this.subscription8?.unsubscribe()
    this.subscription9?.unsubscribe()
  }


  
}
