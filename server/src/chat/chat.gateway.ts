import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { Message } from './utils/models/message.interface';
import { Body, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/user/utils/models/user.interface';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Room } from './utils/models/room.interface';
import * as jwt from 'jsonwebtoken';
import { PrivateChatService } from './utils/services/privateChat.service';
import { RoomChatService } from './utils/services/roomChat.service';

@WebSocketGateway({cors: {origin: 'http://localhost:4200'}})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer() server: Server

  messages:Message[] = []
  id:string[] = []

  constructor(private privateChatService:PrivateChatService, private roomChatService:RoomChatService, private authService:AuthService, private userService:UserService) {
  }

  handleDisconnect(client: Socket) {
    console.log("DISCONNECTED");
  }

  @UseGuards(JwtGuard)
  handleConnection(client: Socket, ...args: any[]) 
  {
    console.log("CONNECTED  ", client.id);
    this.id.push(client.id)
  }

  @SubscribeMessage('updateSocketId')
  updateSocketId(client:Socket, userId:number) {
    this.userService.updateUser(userId, client.id)
    client.emit('updated', client.id);
  }

  @SubscribeMessage('privateMessage')
  handlePrivateMessage(client: Socket, data: any) {
      this.privateChatService.saveMessage(data.message)
      // console.log("SOCKET ", data.user.socketId);
      
      // this.server.to([data.user.socketId, client.id]).emit('recMessage', data.message);
      this.server.emit('recMessage', data.message);
      // this.server.to([this.id[0], this.id[1]]).emit('recMessage', data.message);
  }

  @SubscribeMessage('getConversation')
  async getConversation(client: Socket, data:any) {
    // const messages = await this.chatService.getConversation(data.senderId, data.receiverId).toPromise();
    this.privateChatService.getConversation(data.senderId, data.receiverId).subscribe(data=>this.server.to(client.id).emit('getConversation', data))
    // this.server.to(client.id).emit('getConversation', messages);
  }

  @SubscribeMessage('getLastMessage')
  getLastMessage(client:Socket, id:number) {
    this.privateChatService.getLastMessage(id).subscribe(data=>{
      if (!data.length)
        client.emit('recLastMessage', [{id:0, senderId:id, receiverId:id, message:"Welcome", date:new Date}])
      else
        client.emit('recLastMessage', data);
    });
  }

  @SubscribeMessage('updateReaded')
  updateReaded(client:Socket, message:Message) {
    this.privateChatService.updateReaded(message);
  }

  @SubscribeMessage('getNotReadedMessages')
  async getNotReadedMessages(client:Socket, id:number) {
    const data = await this.privateChatService.getUnreadMessageCountsBySenderId(id)
      this.server.to(client.id).emit('recNotReadedMessages', data)
    
  }

  ////////////////////////// ROOMS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  @SubscribeMessage('getUnreadedRoomMessages')
  async getUnreadedRoomMessages(client:Socket, id:number) {
    const data = await this.roomChatService.getUnreadedRoomMessages(id)
    console.log(data);
    
      this.server.to(client.id).emit('recNotReadedRoomMessages', data)
    
  }

  @SubscribeMessage('getRooms')
  getRooms(client:Socket, id:number) {
    this.roomChatService.getRooms(id).subscribe(data=>{
      client.emit('recRooms', data);
    })
  }

  @SubscribeMessage('getRoomById')
  getRoomById(client:Socket, id:number) {
    this.roomChatService.getRoomById(id).subscribe(room=>client.emit('recRoomById', room))
  }

  @SubscribeMessage('roomMessage')
  roomMessage(client:Socket, data:any) {
    this.privateChatService.saveMessage(data.message);
    let usersId:(number[]) = data.room.usersId;
    usersId.forEach(id=> {
      this.userService.getUserById(id).subscribe(user=>{
        this.server.to(user.socketId).emit('recRoomMessage', data.message);
      })
    })
  }

  @SubscribeMessage('roomConversation')
  roomConversation(client:Socket, room:Room) {
    this.roomChatService.getRoomConversation(room.id).subscribe(data=>{
      this.server.to(client.id).emit('recRoomConversation', data)
    })
  }

  @SubscribeMessage('getRoomLastMessage')
  getRoomLastMessage(client:Socket, id:number) {
    this.roomChatService.getMessagesByUserId(id).subscribe(data=>{
      if (!data.length)
        client.emit('recRoomLastMessage', [{id:0, senderId:id, receiverId:id, message:"Welcome", date:new Date(), roomId:1}])
      else
        client.emit('recRoomLastMessage', data)
    });
  }

  @SubscribeMessage('getOtherRooms')
  getOtherRooms(client:Socket) {
    this.roomChatService.getAllRooms().subscribe(data=>client.emit('recOtherRooms', data))
  }

  @SubscribeMessage('getRoomMembers')
  getRoomMembers(client:Socket, room:Room) {
    this.roomChatService.getRoomMembers(room).subscribe(data=>{
      client.emit('recRoomMembers', data)
    })
  }
}
