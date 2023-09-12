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

  userId?:number
  addRoom:boolean = false
  users:{user:IUserDataShort, added:boolean, admin:boolean}[] = []

  roomFormularTitles:any[] = [{title:'Give your room a name', error:false}, {title:'Add people to your room', error:false}]

  selectedFile?: File

  searchQuery: string = '';
  searchResults: IUserDataShort[] = [];
  nextStep:boolean = false
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

    // RESET FORMULAR IF USER OPEN CONVERSATION
    this.subscription3 = chatService.displayConversation$.subscribe(data=> {
      if (data)
        this.resetRoomFormular()
    })
  }

  ngOnInit(): void {
    this.getfriendList();
    this.subscription5 = this.chatService.displayConvers$.subscribe(data=> this.displayConvers = data)
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
    this.chatService.displayComponents(true, false, false, true, true, false, false)
  }

  addToRoom(user:{user:IUserDataShort, added:boolean, admin:boolean}) {
    user.added = !user.added
  }

  addAdmin(user:{user:IUserDataShort, added:boolean, admin:boolean}) {
    user.added = !user.added
    user.admin = !user.admin
  }

  getConversations() {
    this.resetRoomFormular()
    this.addRoom = false
    this.chatService.displayComponents(false, false, false, true, false, false, false)
  }

  handleFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  async createRoom() {
    let usersAdded = this.users.filter(user=> user.added === true)
    let admins = this.users.filter(user=> user.admin === true);
    let usersId: (number)[] = []
    usersAdded.forEach(item=> {
      usersId.push(item.user.id!)
    })
    usersId.push(this.userId!)

    let adminsId: number[] = []
    admins.forEach(admin=> {
      adminsId.push(admin.user.id!)
    })
    adminsId.push(this.userId!)

    const formData = new FormData();
    formData.append('image', this.selectedFile!)
    const avatar  = await firstValueFrom( this.userService.uploadImage(formData));
    let path:string = this.room.value.imagePath


    let room = {adminId:adminsId, name:this.room.value.name, usersId:usersId, imagePath:avatar.filename};
    if (usersId.length > 1 && this.room.value.name && this.room.value.imagePath) {
      this.roomFormular = room;
      this.nextStep = true
      this.roomFormularTitles[1].error = false
      this.roomFormularTitles[0].error = false
      this.chatService.backToRoomFormularSource.next(false);
      this.resetRoomFormular()
    }
    else {
      if (usersId.length <= 1)
        this.roomFormularTitles[1].error = true
      else
        this.roomFormularTitles[1].error = false
      if (!this.room.value.name)
        this.roomFormularTitles[0].error = true
      else
        this.roomFormularTitles[0].error = false
    }
  }

  resetRoomFormular() {
    this.room.reset()
    this.users.forEach(item=>item.added = false)
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


  getfriendList() {
    this.userService.getfriendList(this.userId!).subscribe({

     next: (response :IUserDataShort[]) => {

      response.forEach((user)=>{
        if (user.id != this.userId) {
          this.users?.push({user:user, added:false, admin:false})
        }
      })
      
     },
     error: error => {
       console.error('Error:', error.error.message); 
     }
   });
 }
}
