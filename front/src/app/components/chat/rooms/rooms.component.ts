import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { ChatService } from '../../../services/chat.service';
import { Room } from 'src/app/models/room.model';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {

  smallScreen:boolean = false;
  
  userId?:number;

  rooms:Room[] = []
  constructor(private loginService:LoginService, private chatService:ChatService) {
    this.loginService.userId.pipe(take(1)).subscribe((id?:any) => {
      this.userId = id;
    })
  }

  ngOnInit(): void {
    this.chatService.sendToGetRooms(this.userId!);
    this.chatService.getRooms().subscribe(data=>{
      data.forEach(item=> {
        this.rooms.push(item)
      })
    })
  }
}
