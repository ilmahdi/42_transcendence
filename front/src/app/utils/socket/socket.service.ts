import { Injectable } from '@angular/core';
import { CustomSocket } from './socket.module';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(
    private socket: CustomSocket,
  ) {
  }


  initSocketConnection(userId: string) {
    this.socket.connect();

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');

    });
  }
  
  endSocketConnection(userId :string) {
    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      
    });

  }
}
