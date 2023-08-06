import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Observable, Subscription, take } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Conversation } from '../models/Conversation';
import { Message } from '../models/message.model';
import { User } from '../models/user.model';
import { ChatSocketService } from '../components/chat/core/chat-socket.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http:HttpClient) { }

  token:string|null = localStorage.getItem('token');
  
  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Authorization': `Bearer ${this.token}` }),
  };

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:3000/api/auth/allUsers', this.httpOptions).pipe(take(1));
  }

  sendMessage(message:Message) {
    return this.http.post('http://localhost:3000/api/chat/messages', message);
  }

  getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>('http://localhost:3000/api/chat/getMessages')
  }
}
