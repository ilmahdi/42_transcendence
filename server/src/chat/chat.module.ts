import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './utils/models/message.entity';

@Module({
  providers: [ChatGateway, ChatService],
  controllers: [ChatController],
  imports: [
    TypeOrmModule.forFeature([MessageEntity])
  ]
})
export class ChatModule {}
