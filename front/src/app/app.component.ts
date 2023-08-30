import { Component, OnInit } from '@angular/core';
import { SocketService } from './utils/socket/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor (
    private socketService: SocketService,
  ) {
  }
  ngOnInit(): void {
    this.socketService.initSocketConnection();
  }

  ngOnDestroy():void {
    this.socketService.endSocketConnection();
  }
}
