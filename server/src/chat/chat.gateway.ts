import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { Message } from './utils/models/message.interface';
import { Body, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/user/utils/models/user.interface';
import { UserService } from 'src/user/user.service';

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

  @UseGuards(JwtGuard)
  handleConnection(client: Socket, ...args: any[]) 
  {
    console.log("CONNECTED  ", client.id)
    this.id.push(client.id)
    // this.userService.updateUser(this.authService.getJwtUser(jwt), client.id)
  }

  @SubscribeMessage('updateSocketId')
  updateSocketId(client:Socket, userId:number) {
    this.userService.updateUser(userId, client.id)
    client.emit('updated', client.id);
  }

  @SubscribeMessage('privateMessage')
  handlePrivateMessage(client: Socket, data: any) {
    this.chatService.saveMessage(data.message)
    console.log(data.user.socketId);
    
    this.server.to([data.user.socketId, client.id]).emit('recMessage', data.message);
  }

  @SubscribeMessage('getConversation')
  async getConversation(client: Socket, data:any) {
    // const messages = await this.chatService.getConversation(data.senderId, data.receiverId).toPromise();
    this.chatService.getConversation(data.senderId, data.receiverId).subscribe(data=>this.server.to(client.id).emit('getConversation', data))
    // this.server.to(client.id).emit('getConversation', messages);
  }

  @SubscribeMessage('getLastMessage')
  getLastMessage(client:Socket, ids:any) {
    this.chatService.getLastMessage(ids.id1, ids.id2).subscribe(data=>{
      console.log(data);
      
      client.emit('recLastMessage', data);
    });
    
    // client.emit('recLastMessage', this.chatService.getLastMessage(userId))
  }
}
