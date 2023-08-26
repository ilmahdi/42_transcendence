import { Body, Controller, Get, Param, Post, Put, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Message } from './utils/models/message.interface';
import { MessageBody } from '@nestjs/websockets';
import { Observable, from, of } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path'; 
import { Room } from './utils/models/room.interface';
import { join } from 'path/posix';

export const storage = {
  storage:diskStorage({
    destination: './uploads/images',
    filename: (req, file, cb)=> {
      const originalname = file.originalname || 'default.jpg'; 
      const filename: string = path.parse(originalname).name.replace(/\s/g, '');
      const extension: string = path.parse(originalname).ext;

      cb(null, `${filename}${extension}`)
    }
  })
}

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

  @Post('notReaded')
  notReaded(@Body() id:number) {
    return this.chatService.getUnreadMessageCountsBySenderId(id)
  }

  @Get('search')
  async searchConversation(@Query('query') query:string) {
    const users = await this.chatService.searchConversation(query);
    return users;
  }

  ////////////////////////////////////////// ROMMS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  @Post('createRoom')
  createRoom(@Body() room:Room) {
    this.chatService.createRoom(room);
    return room
  }

  @Get('allRooms')
  getAllRooms() {
    return this.chatService.getAllRooms();
  }

  @Get('searchRoom')
  async searchRoom(@Query('query') query:string) {
    const rooms = await this.chatService.searchRooms(query);
    return rooms;
  }

  ////////////////////////////////////////// UPLOAD IMAE \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', storage))
  uploadFile(@UploadedFile() file): Observable<string> {
    if (file)
      return from(file.filename as string);
    return from('default.jpg')
  }

  @Get('image/:imagePath')
  findImage(@Param('imagePath') imagePath, @Res() res) {
    return of(res.sendFile(join(process.cwd(), 'uploads/images/' + imagePath)));
  }
}
