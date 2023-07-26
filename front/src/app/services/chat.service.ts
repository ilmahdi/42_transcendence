import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { MessageEntity } from '../../../../server/src/chat/utils/models/message.entity';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private socket: Socket) { }

  sendMessage(message:any) {
    this.socket.emit('sendMessage', message);
  }

  getNewMessage(): Observable<MessageEntity> {
    return this.socket.fromEvent<MessageEntity>('newMessage');
  }
}
