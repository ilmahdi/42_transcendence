import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { ConnectionGateway } from 'src/common/gateways/connection.gateway';
import { ConnectionModule } from 'src/common/gateways/connection.module';

@Module({
  imports: [ConnectionModule],
  providers: [ChatGateway, ChatService],
  controllers: [ChatController]
})
export class ChatModule {}
