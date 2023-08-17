import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { ChatService } from '../../../services/chat.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {

  smallScreen:boolean = false;
  
  userId?:number;

  constructor(private loginService:LoginService, private chatService:ChatService) {
    this.loginService.userId.pipe(take(1)).subscribe((id?:any) => {
      this.userId = id;
    })
  }

  ngOnInit(): void {
  }

}
