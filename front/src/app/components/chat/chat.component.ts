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

  userEvent?:any[]
  conversationEvent!:Message[];
  roomData?:any[]

  directClicked: boolean = true
  roomsClicked: boolean = false
  screenWidth: number = 1000;
  smallScreen:boolean = false;
  displayConvers:boolean = false;

  userId?:number
  addRoom:boolean = false
  users:{user:User, added:boolean}[] = []

  roomFormularTitles:any[] = [{title:'Give your room a name', error:false}, {title:'Add people to your room', error:false}]

  selectedFile?: File
  constructor(private chatService:ChatService, private loginService:LoginService, private router:Router) {
    this.screenWidth = window.innerWidth;
    window.addEventListener('resize', this.onResize.bind(this));

    this.loginService.userId.pipe(take(1)).subscribe((id?:any) => {
      this.userId = id;
    })
    chatService.sendToGetLastMessage(this.userId!)
    chatService.sendToGetRoomLastMessage(this.userId!)
  }

  ngOnInit(): void {
    this.chatService.getUsers().subscribe((data) => {
      data.forEach((user)=>{
        if (user.id != this.userId) {
          this.users?.push({user:user, added:false})
        }
      })
    });
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

  conversEvent(convers:boolean) {
    this.displayConvers = convers
  }

  onCustomEvent(user:User) {
    this.smallScreen = true
    this.userEvent = [user, true]
    this.displayConvers = false
    this.roomData = []
  }

  getConversation(data:Message[]) {
    this.conversationEvent = data;
  }

  displayFormRoom() {
    this.chatService.roomFormular(true)
    this.chatService.add$.subscribe(data=>this.addRoom = data)
  }

  addToRoom(user:{user:User, added:boolean}) {
    user.added = !user.added
  }

  getConversations() {
    this.addRoom = false
  }

  handleFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  createRoom() {
    let usersAdded = this.users.filter(user=> user.added === true)
    let usersId: (number)[] = []
    usersAdded.forEach(item=> {
      usersId.push(item.user.id!)
    })
    usersId.push(this.userId!)

    const formData = new FormData();
    formData.append('file', this.selectedFile!)
    this.chatService.uploadImage(formData).subscribe()
    let path:string = this.room.value.imagePath
    let imageName = path.split('\\')

    let room = {adminId:this.userId, name:this.room.value.name, usersId:usersId, imagePath:imageName[imageName.length - 1]};
    if (usersId.length && this.room.value.name && this.room.value.imagePath) {
      this.chatService.createRoom(room).subscribe()
      this.room.reset()
      usersAdded.forEach(item=>item.added = false)
    }
    else {
      if (!usersId.length)
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
    this.roomData = [room, true]
  }
}
