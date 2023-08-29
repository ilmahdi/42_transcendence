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
    const userId = 'your-user-id';
    this.socketService.initSocketConnection(userId);
  }

  ngOnDestroy():void {
    const userId = 'your-user-id';
    this.socketService.endSocketConnection(userId);
  }
}
