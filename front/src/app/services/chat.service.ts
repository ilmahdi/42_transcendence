import { Injectable, Input } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, fromEvent, take } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Message } from '../models/message.model';
import { User } from '../models/user.model';
import * as io from 'socket.io-client';
import { ChatSocketService } from './core/chat-socket.service';
import { LoginService } from './login.service';
import { Room } from '../models/room.model';

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

  backToRoomFormularSource = new BehaviorSubject<boolean>(false)
  backToRoomFormular$ = this.backToRoomFormularSource.asObservable()

  addRoom = new BehaviorSubject<boolean>(false)
  add$ = this.addRoom.asObservable()

  conversationSource = new BehaviorSubject<Message[]>([])
  conversation$ = this.conversationSource.asObservable()

  roomConversationSource = new BehaviorSubject<Message[]>([])
  roomConversation$ = this.roomConversationSource.asObservable()

  roomLastMessageSource = new BehaviorSubject<any>({});
  roomLastMessage$ = this.roomLastMessageSource.asObservable()

  notReadedMessageSource = new BehaviorSubject<{ senderId: number; unreadCount: number }[]>([]);
  notReadedMessage$ = this.notReadedMessageSource.asObservable()

  notReadedRoomMessageSource = new BehaviorSubject<{senderId:number, roomId: number; unreadCount: number }[]>([]);
  notReadedRoomMessage$ = this.notReadedRoomMessageSource.asObservable()

  usersSource = new BehaviorSubject<User[]>([]);
  users$ = this.usersSource.asObservable()

  roomsSource = new BehaviorSubject<Room[]>([]);
  rooms$ = this.roomsSource.asObservable()

  displayOtherRoomsSource = new BehaviorSubject<boolean>(false);
  displayOtherRooms$ = this.displayOtherRoomsSource.asObservable()

  displayConversationSource = new BehaviorSubject<boolean>(false);
  displayConversation$ = this.displayConversationSource.asObservable()

  constructor(private http:HttpClient, private socket:ChatSocketService, private loginService:LoginService) {
    this.loginService.userId.pipe(take(1)).subscribe((id?:any) => {
      this.userId = id
    })
    this.socket.connect()
    this.updateSocketId(this.userId!)
    this.sendToGetLastMessage(this.userId!)
    this.sendToGetRoomLastMessage(this.userId!)

    this.sendToGetNotReadedMessages(this.userId!);
    this.getNotReadedMessages().subscribe(data=>{
      this.updateReadedBehav(data);
    })

    this.sendToGetNotReadedRoomMessages(this.userId!);
    this.getNotReadedRoomMessages().subscribe(data=>{
      this.updateReadedRoomBehav(data)
    })
  }

  displayComponents(formular:boolean, conversation:boolean, otherRooms:boolean, backto:boolean) {
    this.roomFormular(formular)
    this.displayConversationSource.next(conversation);
    this.displayOtherRoomsSource.next(otherRooms);
    this.backToRoomFormularSource.next(backto)
  }

  updateRooms(rooms:Room[]) {
    this.roomsSource.next(rooms)
  }

  updateUsers(users:User[]) {
    users = users.filter(item=> item.id !== this.userId)
    this.usersSource.next(users);
  }

  setSocket(socket:ChatSocketService) {
    this.socket = socket
  }

  roomFormular(statue:boolean) {
    this.addRoom.next(statue);
  }

  updateReadedBehav(data:{ senderId: number; unreadCount: number }[]) {
    this.notReadedMessageSource.next(data)
  }

  updateReadedRoomBehav(data:{senderId:number, roomId: number; unreadCount: number }[]) {
    this.notReadedRoomMessageSource.next(data)
  }

  updateConversation(conversation:Message[]) {
    this.conversationSource.next(conversation)
  }

  updateRoomConversation(roomConversation:Message[]) {
    this.roomConversationSource.next(roomConversation);
  }

  updateLastMessage(message: Message) {
    this.stringSource.next(message);
  }

  updateRoomLastMessage(message:Message) {
    this.roomLastMessageSource.next(message);
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

  sendToGetRoomLastMessage(id:number) {
    this.socket.emit('getRoomLastMessage', id);
  }

  getRoomLastMessage() {
    return this.socket.fromEvent<Message[]>('recRoomLastMessage');
  }

  sendToGetRooms(id:number) {
    this.socket.emit('getRooms', id);
  }

  getRooms() {
    return this.socket.fromEvent<Room[]>('recRooms');
  }

  sendRoomMessage(id:number, room:Room, message:Message) {
    this.socket.emit('roomMessage', {senderId:id, room:room, message:message})
  }

  getRoomMessage() {
    return this.socket.fromEvent<Message>('recRoomMessage');
  }

  sendToGetRoomConversation(room:Room) {
    this.socket.emit('roomConversation', room);
  }

  getRoomConversation() {
    return this.socket.fromEvent<Message[]>('recRoomConversation')
  }

  sendToGetNotReadedMessages(receiverId:number) {
    this.socket.emit('getNotReadedMessages', receiverId);
  }

  getNotReadedMessages() {
    return this.socket.fromEvent<{ senderId: number; unreadCount: number }[]>('recNotReadedMessages');
  }

  sendToGetNotReadedRoomMessages(receiverId:number) {
    this.socket.emit('getUnreadedRoomMessages', receiverId);
  }

  getNotReadedRoomMessages() {
    return this.socket.fromEvent<{senderId:number, roomId: number; unreadCount: number}[]>('recNotReadedRoomMessages')
  }

  sendTetOtherRooms() {
    this.socket.emit('getOtherRooms');
  }

  getOtherRooms() {
    return this.socket.fromEvent<Room[]>('recOtherRooms');
  }

  token:string|null = localStorage.getItem('token');
  
  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Authorization': `Bearer ${this.token}` }),
  };

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:3000/api/auth/allUsers', this.httpOptions).pipe(take(1));
  }

  updateReaded(message:Message) {
    this.socket.emit('updateReaded', message)
  }

  createRoom(room:Room): Observable<Room> {
    return this.http.post('http://localhost:3000/api/chat/createRoom', room);
  }

  getAllRooms() {
    return this.http.get<Room[]>('http://localhost:3000/api/chat/allRooms')
  }

  uploadImage(image:FormData) {
    return this.http.post('http://localhost:3000/api/chat/upload', image);
  }

  searchConvers(name:string) {
    return this.http.get<User[]>('http://localhost:3000/api/chat/search?query=' + name)
  }

  searchRooms(name:string) {
    return this.http.get<Room[]>('http://localhost:3000/api/chat/searchRoom?query=' + name)
  }

  joinRoom(id:number, room:Room) {
    const data = {id:id, room:room}
    return this.http.post<Room>('http://localhost:3000/api/chat/joinRoom', data)
  }

  joinProtected(id:number, room:Room, password:string) {
    const data = {id:id, room:room, password:password}
    return this.http.post<boolean>('http://localhost:3000/api/chat/joinProtected', data)
  }
}
