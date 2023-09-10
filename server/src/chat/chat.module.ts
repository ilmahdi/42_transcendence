import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { PrivateChatService } from './utils/services/privateChat.service';
import { RoomChatService } from './utils/services/roomChat.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConnectionGateway } from 'src/common/gateways/connection.gateway';
import { ConnectionModule } from 'src/common/gateways/connection.module';
import { TokenService } from 'src/common/services/token.service';

@Module({
  providers: [
    AuthService,
    JwtService,
    ChatGateway,
    UserService,
    PrivateChatService,
    RoomChatService,
    PrismaService, 
    TokenService,
  ],
  controllers: [ChatController],
  imports: [
    PrismaModule, ConnectionModule
  ],
})
export class ChatModule {}
