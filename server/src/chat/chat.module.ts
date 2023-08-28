import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './utils/models/message.entity';
import { UserEntity } from '../user/utils/models/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { RoomEntity } from './utils/models/room.entity';
import { PrivateChatService } from './utils/services/privateChat.service';
import { RoomChatService } from './utils/services/roomChat.service';

@Module({
  providers: [AuthService, JwtService, ChatGateway, UserService, PrivateChatService, RoomChatService],
  controllers: [ChatController],
  imports: [
    TypeOrmModule.forFeature([MessageEntity, UserEntity, RoomEntity])
  ]
})
export class ChatModule {}
