import { Injectable, Input } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, fromEvent, take } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Message } from '../models/message.model';
import { User } from '../models/user.model';
import { Room } from '../models/room.model';
import { RoomType } from '../models/roomType.enum';
import { CustomSocket } from '../utils/socket/socket.module';
import { AuthService } from './auth.service';
import { IUserDataShort } from '../utils/interfaces/user-data.interface';

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

  displayConversSource = new BehaviorSubject<boolean>(true);
  displayConvers$ = this.displayConversSource.asObservable();

  optionsSource = new BehaviorSubject<boolean>(false);
  options$ = this.optionsSource.asObservable()

  addMemberSource = new BehaviorSubject<boolean>(false);
  addMember$ = this.addMemberSource.asObservable();

  clickOnConversationSource = new BehaviorSubject<{click:boolean, user:IUserDataShort}>({click:false, user:{}})
  clickOnConversation$ = this.clickOnConversationSource.asObservable()

  readSymbolSource = new BehaviorSubject<{senderId:number, receiverId:number, read:boolean}[]>([])
  readSymbol$ = this.readSymbolSource.asObservable()

  otherRoomSource = new BehaviorSubject<Room[]>([])
  otherRoom$ = this.otherRoomSource.asObservable()

  roomOptionsSource = new BehaviorSubject<Room>({})
  roomOptions$ = this.roomOptionsSource.asObservable();

  constructor(
    private http:HttpClient, 
    private socket: CustomSocket,
    private authService:AuthService,
    ) {
    this.userId = this.authService.getLoggedInUserId();
    this.socket.connect()
    this.updateSocketId(this.userId!)
    this.sendToGetLastMessage(this.userId!)
    this.sendToGetRoomLastMessage(this.userId!)

    this.sendToGetNotReadedMessages(this.userId!);
    this.getNotReadedMessages().subscribe(data=>{
      this.updateReadBehav(data);
    })

    this.sendToGetNotReadedRoomMessages(this.userId!);
    this.getNotReadedRoomMessages().subscribe(data=>{
      this.updateReadRoomBehav(data)
    })
  }

  displayComponents(formular:boolean, conversation:boolean, otherRooms:boolean, backto:boolean, convers:boolean, options:boolean, addMember:boolean) {
    this.roomFormular(formular)
    this.displayConversationSource.next(conversation);
    this.displayOtherRoomsSource.next(otherRooms);
    this.backToRoomFormularSource.next(backto);
    this.displayConversSource.next(convers)
    this.optionsSource.next(options)
    this.addMemberSource.next(addMember)
  }

  calculatTimeBetweenMessages(messages:Message[]) {
    let i:number = 0
    let lateMessage:{late:boolean, time:string, msg:Message}[] = []
    while (messages.length > i + 1){
      const t1 = new Date(messages[i + 1].date!).getMinutes()
      const t2 = new Date(messages[i].date!).getMinutes()
      if (t1 - t2 >= 1) {
        const options: Intl.DateTimeFormatOptions = {
          day: '2-digit',   // Two-digit day
          month: '2-digit', // Two-digit month
          year: 'numeric'   // Full year
        };
        const formattedDate: string = new Date(messages[i + 1].date!).toLocaleDateString('en-GB', options);
        let date = {late:true, time:`${formattedDate}, ${new Date(messages[i + 1].date!).getHours()}:${new Date(messages[i + 1].date!).getMinutes()}`, msg:messages[i + 1]}
        lateMessage.push(date)
      }
      ++i;
    }
    return lateMessage
  }

  updateRooms(rooms:Room[]) {
    this.roomsSource.next(rooms)
  }

  updateUsers(users:User[]) {
    users = users.filter(item=> item.id !== this.userId)
    this.usersSource.next(users);
  }

  roomFormular(statue:boolean) {
    this.addRoom.next(statue);
  }

  updateReadBehav(data:{ senderId: number; unreadCount: number }[]) {
    this.notReadedMessageSource.next(data)
  }

  updateReadRoomBehav(data:{senderId:number, roomId: number; unreadCount: number }[]) {
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

  sendToGetRoomById(id:number) {
    this.socket.emit('getRoomById', id)
  }

  getRoomById() {
    return this.socket.fromEvent<Room>('recRoomById');
  }

  sendReadSignal() {
    this.socket.emit('readSignal');
  }

  getReadSignal() {
    return this.socket.fromEvent<boolean>('recReadSignal');
  }

  token:string|null = localStorage.getItem('token');
  
  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Authorization': `Bearer ${this.token}` }),
  };

  getUsers(): Observable<IUserDataShort[]> {
    return this.http.get<IUserDataShort[]>('http://localhost:3000/api/chat/allUsers', this.httpOptions).pipe(take(1));
  }

  updateRead(message:Message) {
    this.socket.emit('updateRead', message)
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

  // getRoomMembers(room:Room) {
  //   return this.http.post<User[]>('http://localhost:3000/api/chat/roomMembers' , room);
  // }

  sendToGetRoomMembers(room:Room) {
    this.socket.emit('getRoomMembers', room)
  }

  getRoomMembers() {
    return this.socket.fromEvent<{user:IUserDataShort, type:string}[]>('recRoomMembers');
  }

  updateRoom(room:Room) {
    this.socket.emit('updateRoom', room)
    // return this.http.post('http://localhost:3000/api/chat/updateRoom', room);
  }
}
