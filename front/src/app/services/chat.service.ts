import { Injectable, Input } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, fromEvent, take } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Message } from '../models/message.model';
import { User } from '../models/user.model';
import * as io from 'socket.io-client';
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

  lastConversation:any
  last:any[] = []

  addRoom = new BehaviorSubject<boolean>(false)
  add$ = this.addRoom.asObservable()

  conversationSource = new BehaviorSubject<Message[]>([])
  conversation$ = this.conversationSource.asObservable()

  constructor(private http:HttpClient, private socket:ChatSocketService, private loginService:LoginService) {
    this.loginService.userId.pipe(take(1)).subscribe((id?:any) => {
      this.userId = id
    })
    this.socket.connect()
    this.updateSocketId(this.userId!)
    this.sendToGetLastMessage(this.userId!)
  }

  setSocket(socket:ChatSocketService) {
    this.socket = socket
  }

  createRoom(statue:boolean) {
    this.addRoom.next(statue);
  }

  updateConversation(conversation:Message[]) {
    this.conversationSource.next(conversation)
  }

  updateLastMessage(message: Message) {
    this.stringSource.next(message);
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

  sendToGetLastMessage(id:number) {
    this.socket.emit('getLastMessage', id);
  }

  getLastMessage() {
    return this.socket.fromEvent<Message[]>('recLastMessage');
  }

  token:string|null = localStorage.getItem('token');
  
  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Authorization': `Bearer ${this.token}` }),
  };

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:3000/api/auth/allUsers', this.httpOptions).pipe(take(1));
  }

  updateReaded(receiverId:number, senderId:number) {
    this.socket.emit('updateReaded', {receiverId:receiverId, senderId:senderId})
  }
}
