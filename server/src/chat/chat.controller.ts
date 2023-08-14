import { Body, Controller, Get, Post, Put, Res } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Message } from './utils/models/message.interface';
import { MessageBody } from '@nestjs/websockets';
import { Observable } from 'rxjs';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService:ChatService) {}

  @Post('messages')
  async messages(@Body() msg:Message) {
      this.chatService.saveMessage(msg)
      // await this.chatService.trigger('chat', 'message', msg);
      return [];
  }

  @Get('getMessages')
  getMessages() {
    return this.chatService.getMessages()
  }

  @Post('getConversation')
  getConversation(@Body() data:any) {
    return this.chatService.getConversation(data.senderId, data.receiverId);
  }

  @Post('getLastMessage')
  getLastMessage(@Body() ids:any) {
    return this.chatService.getLastMessage(ids.senderId, ids.receiverId)
  }
}
