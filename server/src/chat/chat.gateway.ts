import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './utils/dtos/create-chat.dto';
import { UpdateChatDto } from './utils/dtos/update-chat.dto';
import { Server } from 'http';
import { Socket } from 'dgram';
import { MessageEntity } from './utils/models/message.entity';
import { UserEntity } from '../user/utils/models/user.entity';

@WebSocketGateway({cors: {origin: ['http://localhost:4200']}})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server: Server

  handleConnection(client: any, ...args: any[]) {
      console.log('connection');
  }

  handleDisconnect(client: any) {
      console.log('disconnected');
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(socket: Socket, message:MessageEntity): Promise<void> {
    await this.chatService.create(message);
    this.server.emit('newMessage', message);
    console.log(message);
    
  }

  // @SubscribeMessage('sendMessage')
  // handleMessage(socket: Socket, message: string) {
  //   this.server.emit('newMessage', message);
  // }

  @SubscribeMessage('createChat')
  create(@MessageBody() message: MessageEntity) {
    return this.chatService.create(message);
  }

  // @SubscribeMessage('findAllChat')
  // findAll() {
  //   return this.chatService.findAll();
  // }

  // @SubscribeMessage('findOneChat')
  // findOne(@MessageBody() id: number) {
  //   return this.chatService.findOne(id);
  // }

  // @SubscribeMessage('updateChat')
  // update(@MessageBody() updateChatDto: UpdateChatDto) {
  //   return this.chatService.update(updateChatDto.id, updateChatDto);
  // }

  // @SubscribeMessage('removeChat')
  // remove(@MessageBody() id: number) {
  //   return this.chatService.remove(id);
  // }
}
