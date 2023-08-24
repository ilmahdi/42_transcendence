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

@WebSocketGateway({cors: {origin: 'http://localhost:4200'}})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer() server: Server

  messages:Message[] = []
  id:string[] = []

  constructor(private chatService:ChatService, private authService:AuthService, private userService:UserService) {
  }

  handleDisconnect(client: Socket) {
    console.log("DISCONNECTED");
  }


  // getLoggedInUser(): string {
  //   const token = localStorage.getItem(JWT_TOKEN);
  //   if (token) {
  //     const decodedToken = this.jwtHelper.decodeToken(token);
  //     return decodedToken.username;
  //   }
  //   return "";
  // }


  @UseGuards(JwtGuard)
  handleConnection(client: Socket, ...args: any[]) 
  {
    console.log("CONNECTED  ", client.id);
    this.id.push(client.id)

    // const jwt = client.handshake.headers.authorization || null;
    // this.userService.updateUser(this.authService.getJwtUser(jwt), client.id);
  }

  @SubscribeMessage('updateSocketId')
  updateSocketId(client:Socket, userId:number) {
    this.userService.updateUser(userId, client.id)
    client.emit('updated', client.id);
  }

  @SubscribeMessage('privateMessage')
  handlePrivateMessage(client: Socket, data: any) {
      this.chatService.saveMessage(data.message)
      // console.log("SOCKET ", data.user.socketId);
      
      // this.server.to([data.user.socketId, client.id]).emit('recMessage', data.message);
      this.server.emit('recMessage', data.message);
      // this.server.to([this.id[0], this.id[1]]).emit('recMessage', data.message);
  }

  @SubscribeMessage('getConversation')
  async getConversation(client: Socket, data:any) {
    // const messages = await this.chatService.getConversation(data.senderId, data.receiverId).toPromise();
    this.chatService.getConversation(data.senderId, data.receiverId).subscribe(data=>this.server.to(client.id).emit('getConversation', data))
    // this.server.to(client.id).emit('getConversation', messages);
  }

  @SubscribeMessage('getLastMessage')
  getLastMessage(client:Socket, id:number) {
    this.chatService.getLastMessage(id).subscribe(data=>{
      if (!data.length)
        client.emit('recLastMessage', [{id:0, senderId:id, receiverId:id, message:"Welcome", date:new Date}])
      else
        client.emit('recLastMessage', data);
    });
  }

  @SubscribeMessage('updateReaded')
  updateReaded(client:Socket, message:Message) {
    this.chatService.updateReaded(message);
  }

  @SubscribeMessage('getNotReadedMessages')
  getNotReadedMessages(client:Socket, id:number) {
    this.chatService.getUnreadMessageCountsBySenderId(id).subscribe(data=>{
      client.emit('recNotReadedMessages', data);
    })
    
  }

  ////////////////////////// ROOMS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  @SubscribeMessage('getRooms')
  getRooms(client:Socket, id:number) {
    this.chatService.getRooms(id).subscribe(data=>{
      client.emit('recRooms', data);
    })
  }

  @SubscribeMessage('roomMessage')
  roomMessage(client:Socket, data:any) {
    this.chatService.saveMessage(data.message);
    let usersId:(number[]) = data.room.usersId;
    usersId.forEach(id=> {
      this.userService.getUserById(id).subscribe(user=>{
        this.server.to(user.socketId).emit('recRoomMessage', data.message);
      })
    })
  }

  @SubscribeMessage('roomConversation')
  roomConversation(client:Socket, room:Room) {
    this.chatService.getRoomConversation(room.id).subscribe(data=>{
      this.server.to(client.id).emit('recRoomConversation', data)
    })
  }

  @SubscribeMessage('getRoomLastMessage')
  getRoomLastMessage(client:Socket, id:number) {
    this.chatService.getMessagesByUserId(id).subscribe(data=>{
      if (!data.length)
        client.emit('recRoomLastMessage', [{id:0, senderId:id, receiverId:id, message:"Welcome", date:new Date(), roomId:1}])
      else
        client.emit('recRoomLastMessage', data)
    });
  }
}
