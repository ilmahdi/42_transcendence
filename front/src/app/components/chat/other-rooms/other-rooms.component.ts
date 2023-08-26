import { Component, OnInit } from '@angular/core';
import { Room } from 'src/app/models/room.model';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-other-rooms',
  templateUrl: './other-rooms.component.html',
  styleUrls: ['./other-rooms.component.css']
})
export class OtherRoomsComponent implements OnInit{
  allRooms:Room[] = []
  constructor(private chatService:ChatService) {}

  ngOnInit(): void {
    this.chatService.getAllRooms().subscribe(data=>{
      data.forEach(room=>this.allRooms.push(room))
    })
  }
}
