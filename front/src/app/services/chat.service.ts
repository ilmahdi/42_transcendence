import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, fromEvent, take } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Message } from '../models/message.model';
import { User } from '../models/user.model';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http:HttpClient, private socket:Socket) {
    this.socket.connect();
  }

  sendNewMessage(message:Message){
    this.socket.emit('privateMessage', message);
  }

  getNewMessage(): Observable<Message> {
    return this.socket.fromEvent<Message>('recMessage');
  }

  sendToGetConversation(senderId:number, receiverId:number) {
    const data = {senderId, receiverId}
    this.socket.emit('getConversation', data);
  }

  getConversation() {
    return this.socket.fromEvent<Message[]>('getConversation')
  }

  token:string|null = localStorage.getItem('token');
  
  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Authorization': `Bearer ${this.token}` }),
  };

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:3000/api/auth/allUsers', this.httpOptions).pipe(take(1));
  }

  sendMessage(msg:Message) {
    return this.http.post('http://localhost:3000/api/chat/messages', msg);
  }

  getAllMessages(): Observable<Message[]> {
    return this.http.get<Message[]>('http://localhost:3000/api/chat/getMessages')
  }

  // getConversation(senderId:number, receiverId:number): Observable<Message[]> {
  //   const data = {senderId, receiverId}
  //   return this.http.post<Message[]>('http://localhost:3000/api/chat/getConversation', data)
  // }
}
