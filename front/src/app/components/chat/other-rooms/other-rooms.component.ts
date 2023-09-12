import { Component, EventEmitter, OnInit, Output, ViewChild, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { BehaviorSubject, Subscription, take } from 'rxjs';
import { Room } from 'src/app/models/room.model';
import { RoomType } from 'src/app/models/roomType.enum';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-other-rooms',
  templateUrl: './other-rooms.component.html',
  styleUrls: ['./other-rooms.component.css']
})
export class OtherRoomsComponent implements OnInit, OnDestroy{
  private subscription1?:Subscription
  private subscription2?:Subscription
  private subscription3?:Subscription
  private subscription4?:Subscription
  private subscription5?:Subscription
  private subscription6?:Subscription
  private subscription7?:Subscription
  private subscription8?:Subscription
  private subscription9?:Subscription

  password = new FormGroup({password: new FormControl})
  search = new FormGroup({search: new FormControl})
  allRooms:Room[] = []
  protectSelect:boolean = false;
  userId?:number
  roomWaitForPassword?:Room
  displayList:boolean = false
  searchQuery: string = '';
  searchResults: Room[] = [];
  screenWidth: number = 1000;

  constructor(private chatService:ChatService, private authService:AuthService) {
    this.screenWidth = window.innerWidth;
    window.addEventListener('resize', this.onResize.bind(this));

    this.userId = this.authService.getLoggedInUserId();

    this.subscription2 = chatService.displayOtherRooms$.subscribe(data=> this.displayList = data)
  }

  ngOnInit(): void {
    this.chatService.sendTetOtherRooms()
    this.subscription3 = this.chatService.getOtherRooms().subscribe(data=>{
      this.allRooms = []
      data.forEach(room=>{
        if (!room.usersId?.includes(this.userId!))
          this.allRooms.push(room)
      })
      this.chatService.otherRoomSource.next(this.allRooms)
    })
    this.subscription4 = this.chatService.otherRoom$.subscribe(data=> this.allRooms = data)
  }

  onResize() {
    this.screenWidth = window.innerWidth;
  }

  searchQueryRooms() {
    this.subscription5 = this.chatService.searchRooms(this.searchQuery).subscribe(data=>{
      this.searchResults = []
      data.forEach(room=> {
        if (!room.usersId?.includes(this.userId!))
          this.searchResults.push(room)
      })
      this.chatService.otherRoomSource.next(this.searchResults);
    })
  }

  hideOtherRooms() {
    this.chatService.displayComponents(false, false, false, false, false, false, false)
  }

  updateRoomsConversations() {
    this.chatService.sendToGetRooms(this.userId!);
    this.subscription6 = this.chatService.getRooms().subscribe(data=> this.chatService.updateRooms(data))
  }

  onJoinPublic(room:Room) {
    if (room.type === RoomType.PUBLIC) {
      this.protectSelect = false
      this.subscription7 = this.chatService.joinRoom(this.userId!, room).subscribe(data=> {
        // REMOVE ROOM JOINED FROM THE OTHER ROOMS LIST AND ADD IT TO THE ROOMS CONVERSATIONS LIST
        this.chatService.sendTetOtherRooms()
        this.subscription8 = this.chatService.getOtherRooms().subscribe(data=>{
          this.allRooms = []
          data.forEach(room=>{
            if (!room.usersId?.includes(this.userId!))
              this.allRooms.push(room)
          })
          this.updateRoomsConversations()
        })
      })
    }
    else if(room.type === RoomType.PROTECTED) {
      this.protectSelect = true
      this.roomWaitForPassword = room;
    }
  }

  onJoinProtected() {
    if (this.password.value.password) {
      this.chatService.joinProtected(this.userId!, this.roomWaitForPassword!, this.password.value.password).subscribe(data=>{
        // REMOVE ROOM JOINED FROM THE OTHER ROOMS LIST AND ADD IT TO THE ROOMS CONVERSATIONS LIST
        this.chatService.sendTetOtherRooms()
        this.subscription9 = this.chatService.getOtherRooms().subscribe(data=>{
          this.allRooms = []
          data.forEach(room=>{
            if (!room.usersId?.includes(this.userId!))
              this.allRooms.push(room)
          })
          this.updateRoomsConversations()
        })
      })
      this.protectSelect = false;
    }
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