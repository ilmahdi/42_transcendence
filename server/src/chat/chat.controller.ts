import { Body, Controller, Get, Post, Put, Res } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Message } from './utils/models/message.interface';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService:ChatService) {}

    @Post('messages')
  async messages(/* @Body('username')username:string, @Body('message')message:string */@Body() msg:Message) {
    // console.log(msg);
    this.chatService.saveMessage(msg)
    let message = msg.message
    let username = msg.username
    await this.chatService.trigger('chat', 'message', {username, message});
    return [];
  }

  @Get('getMessages')
  getMessages() {
    return this.chatService.getMessages()
  }
}
