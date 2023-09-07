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

  public get loggedInUserId(): number {
    return this.authService.getLoggedInUserId();
  }

  initSocketConnection() {
    
    if (this.socket.setToken())
      this.socket.connect();


    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      console.log("---->>>>", this.loggedInUserId)
      this.socket.emit("broadcastOnline", this.loggedInUserId);

    });
  }
  
  endSocketConnection() {
    this.socket.disconnect();
    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      
    });

  }
}
