import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({cors: {origin: ['http://localhost:4200']}})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer() server: Server

  constructor(private chatService:ChatService) {
  }
  handleDisconnect(client: any) {
    throw new Error('Method not implemented.');
  }
  handleConnection(client: any, ...args: any[]) {
    throw new Error('Method not implemented.');
  }

    @SubscribeMessage('privateMessage')
    handlePrivateMessage(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
      const { recipientUserId, message } = data;
      // Send the private message to the recipient
      this.chatService.pusher.trigger(`private-${recipientUserId}`, 'privateMessage', message);
    }
}
