import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './utils/models/message.entity';
import { UserEntity } from '../user/utils/models/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { PrivateChatService } from './utils/services/privateChat.service';
import { RoomChatService } from './utils/services/roomChat.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [
    AuthService,
    JwtService,
    ChatGateway,
    UserService,
    PrivateChatService,
    RoomChatService,
    PrismaService, // Include PrismaService
  ],
  controllers: [ChatController],
  imports: [
    PrismaModule, // Use PrismaModule instead of TypeOrmModule
  ],
})
export class ChatModule {}
