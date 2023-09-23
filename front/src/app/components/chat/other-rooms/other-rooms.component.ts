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
  private subscriptions:Subscription[] = []

  password = new FormGroup({password: new FormControl})
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

    const subs:Subscription = chatService.displayOtherRooms$.subscribe(data=> this.displayList = data)
    this.subscriptions.push(subs)
  }

  ngOnInit(): void {
    this.chatService.sendTetOtherRooms(this.userId!)
    const subs1:Subscription = this.chatService.getOtherRooms().subscribe(data=>{
      this.allRooms = []
      data.forEach(room=>{
        if (!room.usersId?.includes(this.userId!) && room.type !== RoomType.PRIVATE)
          this.allRooms.push(room)
      })
      this.chatService.otherRoomSource.next(this.allRooms)
    })
    this.subscriptions.push(subs1)
    const subs2:Subscription = this.chatService.otherRoom$.subscribe(data=> this.allRooms = data)
    this.subscriptions.push(subs2)
  }

  onResize() {
    this.screenWidth = window.innerWidth;
  }

  searchQueryRooms() {
    const subs:Subscription = this.chatService.searchRooms(this.searchQuery).subscribe(data=>{
      this.searchResults = []
      data.forEach(room=> {
        if (!room.usersId?.includes(this.userId!))
          this.searchResults.push(room)
      })
      this.chatService.otherRoomSource.next(this.searchResults);
    })
    this.subscriptions.push(subs)
  }

  hideOtherRooms() {
    this.chatService.displayComponents(false, false, false, false, true, false, false)
  }

  onJoinPublic(room:Room) {
    if (room.type === RoomType.PUBLIC) {
      this.protectSelect = false
      const subs1:Subscription = this.chatService.joinRoom(this.userId!, room).subscribe(data=> {
        // REMOVE ROOM JOINED FROM THE OTHER ROOMS LIST AND ADD IT TO THE ROOMS CONVERSATIONS LIST
        const newRooms:Room[] = this.chatService.roomsSource.value
        newRooms.push(data)
        this.chatService.roomsSource.next(newRooms)
        const otherRooms:Room[] = this.chatService.otherRoomSource.value.filter(item=>item.id != room.id)
        this.chatService.otherRoomSource.next(otherRooms)
      })
      this.subscriptions.push(subs1)
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
        if (data) {
          const newRooms:Room[] = this.chatService.roomsSource.value
          newRooms.push(this.roomWaitForPassword!)
          this.chatService.roomsSource.next(newRooms)
          const otherRooms:Room[] = this.chatService.otherRoomSource.value.filter(item=>item.id != this.roomWaitForPassword!.id)
          this.chatService.otherRoomSource.next(otherRooms)
        }
      })
      this.protectSelect = false;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>sub.unsubscribe())
  }
}
