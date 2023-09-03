import { Injectable } from '@angular/core';
import { CustomSocket } from './socket.module';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(
    private socket: CustomSocket,
    private authService: AuthService,
  ) {
  }

  public loggedInUserId :number = this.authService.getLoggedInUserId();

  initSocketConnection() {
    
    if (this.socket.setToken())
      this.socket.connect();


    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      this.socket.emit("broadcastOnline", this.loggedInUserId);

    });
  }
  
  endSocketConnection() {
    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      
    });

  }
}
