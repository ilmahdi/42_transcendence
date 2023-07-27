import { Body, Controller, Get, Post, Put, Res } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService:ChatService) {}

    @Post()
    async getMessages(
      @Body('senderId') senderId: number,
      @Body('receiverId') receiverId: number,
    ) {
      const messages = await this.chatService.getMessages(senderId, receiverId);
      return { messages };
    }
}
