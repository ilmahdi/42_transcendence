import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Message } from './utils/models/message.interface';
import { Body, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/user/utils/models/user.interface';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Room } from './utils/models/room.interface';
import * as jwt from 'jsonwebtoken';
import { PrivateChatService } from './utils/services/privateChat.service';
import { RoomChatService } from './utils/services/roomChat.service';
import { JwtGuard } from 'src/auth/utils/guards/jwt.guard';
import { ConnectionGateway } from 'src/common/gateways/connection.gateway';

@WebSocketGateway({cors: {origin: 'http://localhost:4200'}})
export class ChatGateway{
  @WebSocketServer() server: Server

  messages:Message[] = []
  id:string[] = []

  constructor(
    private privateChatService:PrivateChatService, 
    private roomChatService:RoomChatService, 
    private authService:AuthService,
    private userService:UserService,
    private readonly connectionGateway :ConnectionGateway,
    ) {
  }

  @SubscribeMessage('privateMessage')
  handlePrivateMessage(client: Socket, data: any) {
    
    this.privateChatService.saveMessage(data.message)
    console.log(data.message);
    const senders = this.connectionGateway.connectedUsersById[data.message.senderId]
      if (senders)
        senders.forEach(id=>{
          this.server.to(id).emit('recMessage', data.message);
        })
      const reciver = this.connectionGateway.connectedUsersById[data.message.receiverId]
      if (reciver)
        reciver.forEach(id=>{
          this.server.to(id).emit('recMessage', data.message);
        })
  }


  @SubscribeMessage('getConversation')
  async getConversation(client: Socket, data:any) {
    const messages = await this.privateChatService.getConversation(data.senderId, data.receiverId)
    this.server.to(client.id).emit('getConversation', messages)
  }

  @SubscribeMessage('getLastMessage')
  async getLastMessage(client:Socket, id:number) {
    const data = await this.privateChatService.getLastMessage(id)
    if (!data.length)
      client.emit('recLastMessage', [{id:0, senderId:id, receiverId:id, message:"Welcome", date:new Date}])
    else
      client.emit('recLastMessage', data);
  }

  @SubscribeMessage('updateRead')
  updateRead(client:Socket, message:Message) {
    this.privateChatService.updateRead(message);
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
    this.server.to(client.id).emit('recNotReadedRoomMessages', data)
  }

  @SubscribeMessage('getRooms')
  async getRooms(client:Socket, id:number) {
    const data = await this.roomChatService.getRooms(id)
    client.emit('recRooms', data);
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

        this.connectionGateway.connectedUsersById[user.id].forEach(id=>{
          this.server.to(id).emit('recRoomMessage', data.message);
        })
      })
    })
  }

  @SubscribeMessage('roomConversation')
  async roomConversation(client:Socket, room:Room) {
    const data = await this.roomChatService.getRoomConversation(room.id)
    this.server.to(client.id).emit('recRoomConversation', data)
  }

  @SubscribeMessage('getRoomLastMessage')
  async getRoomLastMessage(client:Socket, id:number) {
    const data = await this.roomChatService.getMessagesByUserId(id)
      if (!data.length)
        client.emit('recRoomLastMessage', [{id:0, senderId:id, receiverId:id, message:"Welcome", date:new Date(), roomId:1}])
      else
        client.emit('recRoomLastMessage', data)
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

  @SubscribeMessage('updateRoom')
  updateRoom(client:Socket, room:Room) {
    this.roomChatService.changeRoomType(room);
  }

  @SubscribeMessage('readSignal')
  readSignal(client:Socket) {
    this.server.emit('recReadSignal', true);
  }
}
