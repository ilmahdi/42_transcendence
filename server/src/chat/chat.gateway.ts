import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { Message } from './utils/models/message.interface';
import { Body } from '@nestjs/common';

@WebSocketGateway({cors: {origin: 'http://localhost:4200'}})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer() server: Server

  messages:Message[] = []

  constructor(private chatService:ChatService) {
  }
  handleDisconnect(client: any) {
    console.log("CONNECTED");
  }
  handleConnection(client: any, ...args: any[]) {
    console.log("DISCONNECTED");
  }

  @SubscribeMessage('privateMessage')
  handlePrivateMessage(client: Socket, message: Message) {
    console.log(message)
    this.chatService.saveMessage(message);
    client.emit('recMessage', message);
  }

  @SubscribeMessage('getConversation')
  async getConversation(client: Socket, data:any) {
    const messages = await this.chatService.getConversation(data.senderId, data.receiverId).toPromise();
    console.log(messages)
    this.server.emit('getConversation', messages);
  }
}
