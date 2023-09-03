import { Component, OnInit } from '@angular/core';
import { Message } from 'src/app/models/message.model';
import { User } from 'src/app/models/user.model';
import { ChatService } from 'src/app/services/chat.service';
import { LoginComponent } from '../login/login.component';
import { LoginService } from 'src/app/services/login.service';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { FormControl, FormGroup } from '@angular/forms';
import { Room } from 'src/app/models/room.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

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
  users:{user:User, added:boolean, admin:boolean}[] = []

  roomFormularTitles:any[] = [{title:'Give your room a name', error:false}, {title:'Add people to your room', error:false}]

  selectedFile?: File

  searchQuery: string = '';
  searchResults: User[] = [];
  nextStep:boolean = false
  roomFormular:any = {}
  constructor(private chatService:ChatService, private loginService:LoginService) {
    this.screenWidth = window.innerWidth;
    window.addEventListener('resize', this.onResize.bind(this));

    this.loginService.userId.pipe(take(1)).subscribe((id?:any) => {
      this.userId = id;
    })
    chatService.sendToGetLastMessage(this.userId!)
    chatService.sendToGetRoomLastMessage(this.userId!)

    // chatService.sendToGetNotReadedRoomMessages(this.userId!);
    chatService.getNotReadedRoomMessages().subscribe(data=>{
      chatService.updateReadedRoomBehav(data)
    })

    // RESET FORMULAR IF USER OPEN CONVERSATION
    chatService.displayConversation$.subscribe(data=> {
      if (data)
        this.resetRoomFormular()
    })
  }

  ngOnInit(): void {
    this.chatService.getUsers().subscribe((data) => {
      data.forEach((user)=>{
        if (user.id != this.userId) {
          this.users?.push({user:user, added:false, admin:false})
        }
      })
    });
    this.chatService.displayConvers$.subscribe(data=> this.displayConvers = data)
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

  onCustomEvent(user:User) {
    this.smallScreen = true
    this.userEvent = [user, true]
    this.roomData = []
  }

  getConversation(data:Message[]) {
    this.conversationEvent = data;
  }

  displayFormRoom() {
    this.chatService.add$.subscribe(data=>this.addRoom = data)
    this.chatService.displayComponents(true, false, false, true, true, false, false)
  }

  addToRoom(user:{user:User, added:boolean, admin:boolean}) {
    user.added = !user.added
  }

  addAdmin(user:{user:User, added:boolean, admin:boolean}) {
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

  createRoom() {
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
    formData.append('file', this.selectedFile!)
    this.chatService.uploadImage(formData).subscribe()
    let path:string = this.room.value.imagePath
    let imageName = path.split('\\')

    let room = {adminId:adminsId, name:this.room.value.name, usersId:usersId, imagePath:imageName[imageName.length - 1]};
    if (usersId.length > 1 && this.room.value.name && this.room.value.imagePath) {
      this.roomFormular = room;
      this.nextStep = true
      this.roomFormularTitles[1].error = false
      this.roomFormularTitles[0].error = false
      this.chatService.backToRoomFormularSource.next(false);
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

  searchConvers() {
    this.chatService.searchConvers(this.searchQuery).subscribe(data=>{
      this.searchResults = data
      this.chatService.updateUsers(data)
    })
  }

  searchQueryConvers() {
    this.chatService.searchConvers(this.searchQuery).subscribe(data=>{
      this.searchResults = data
      this.chatService.updateUsers(data)
    })
  }

  searchRooms() {
    this.chatService.searchRooms(this.searchQuery).subscribe(data=>{
      this.searchResults = []
      data.forEach(room=> {
        if (room.usersId?.includes(this.userId!))
          this.searchResults.push(room)
      })
      this.chatService.updateRooms(this.searchResults)
    })
  }

  searchQueryRooms() {
    this.chatService.searchRooms(this.searchQuery).subscribe(data=>{
      this.searchResults = []
      data.forEach(room=> {
        if (room.usersId?.includes(this.userId!))
          this.searchResults.push(room)
      })
      this.chatService.updateRooms(this.searchResults)
    })
  }
}
