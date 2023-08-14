import { Injectable, Input } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, fromEvent, take } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Message } from '../models/message.model';
import { User } from '../models/user.model';
import { Socket } from 'ngx-socket-io';
import { ChatSocketService } from './core/chat-socket.service';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  userId?:number;

  private stringSource = new BehaviorSubject<any>({}); // Initial value is an empty string
  string$ = this.stringSource.asObservable();

  users:User[] = [];
  lastMessage = new BehaviorSubject<any[]>([])
  saad$ = this.lastMessage.asObservable()

  constructor(private http:HttpClient, private socket:ChatSocketService, private loginService:LoginService) {
    this.loginService.userId.pipe(take(1)).subscribe((id?:any) => {
      this.userId = id
    })
    this.socket.connect()
    this.updateSocketId(this.userId!)
    // this.socket.fromEvent<string>('updated')
  }

  updateLastMessage(friend:User, message: string) {
    this.stringSource.next({friend:friend, message:message});
  }

  updateSocketId(userId:number) {
    this.socket.emit('updateSocketId', userId);
  }

  getUpdatedSocketId() {
    this.socket.fromEvent<string>('updated');
  }

  sendNewMessage(message:Message, user:any){
    this.socket.emit('privateMessage', {user, message});
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

  sendToGetLastMessage(id1:number, id2:number) {
    this.socket.emit('getLastMessage', {id1, id2});
  }

  getLastMessage() {
    return this.socket.fromEvent<Message>('recLastMessage');
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

  getLast(senderId:number, receiverId:number): Observable<Message[]> {
    const data = {senderId, receiverId}
    return this.http.post<Message[]>('http://localhost:3000/api/chat/getLastMessage', data)
  }
}
