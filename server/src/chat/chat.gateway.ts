import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './utils/dtos/create-chat.dto';
import { UpdateChatDto } from './utils/dtos/update-chat.dto';
import { Server, Socket } from 'socket.io';
import { MessageEntity } from './utils/models/message.entity';
import { UserEntity } from '../user/utils/models/user.entity';
import { Subscription, of, take, tap } from 'rxjs';
import { ActiveConversation } from './utils/models/active-conversation.interface';

@WebSocketGateway({cors: {origin: ['http://localhost:4200']}})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{
  constructor(private readonly chatService: ChatService) {}

  onModuleInit() {
  }

  @WebSocketServer()
  server: Server

  getConversations(socket: Socket, userId: number): Subscription {
    return this.chatService
      .getConversationsWithUsers(userId)
      .subscribe((conversations) => {
        this.server.on('connection', (socket) => {}).emit('conversations', conversations);
      });
  }

  @SubscribeMessage('createConversation')
  createConversation(socket: Socket, friend: UserEntity) {
    this.chatService
      .createConversation(socket.data.user, friend)
      .pipe(take(1))
      .subscribe(() => {
        this.getConversations(socket, socket.data.user.id);
      });
  }

  @SubscribeMessage('sendMessage')
  handleMessage(socket: Socket, newMessage: MessageEntity) {
    if (!newMessage.conversation) return of(null);
    
    const { user } = socket.data;
    newMessage.user = user;

    if (newMessage.conversation.id) {
      this.chatService
        .createMessage(newMessage)
        .pipe(take(1))
        .subscribe((message: MessageEntity) => {
          newMessage.id = message.id;

          this.chatService
            .getActiveUsers(newMessage.conversation.id)
            .pipe(take(1))
            .subscribe((activeConversations: ActiveConversation[]) => {
              activeConversations.forEach(
                (activeConversation: ActiveConversation) => {
                  this.server
                    .to(activeConversation.socketId)
                    .emit('newMessage', newMessage);
                },
              );
            });
        });
    }
    
  }

  handleConnection(client: any, ...args: any[]) {
      console.log('connection');
  }

  handleDisconnect(client: any) {
      console.log('disconnected');
  }
}
