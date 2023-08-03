import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './utils/models/message.entity';
import { ConversationEntity } from './utils/models/conversation.entity';
import { UserEntity } from '../user/utils/models/user.entity';
import { ActiveConversationEntity } from './utils/models/active-conversation.entity';

@Module({
  providers: [ChatGateway, ChatService],
  controllers: [ChatController],
  imports: [
    TypeOrmModule.forFeature([MessageEntity, ConversationEntity, UserEntity, ActiveConversationEntity])
  ]
})
export class ChatModule {}
