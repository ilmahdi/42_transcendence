import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './utils/models/message.entity';
import { UserEntity } from '../user/utils/models/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [ChatService, AuthService, JwtService, ChatGateway, UserService],
  controllers: [ChatController],
  imports: [
    TypeOrmModule.forFeature([MessageEntity, UserEntity])
  ]
})
export class ChatModule {}
