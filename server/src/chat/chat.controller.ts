import { Body, Controller, Get, Param, Patch, Post, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Message } from './utils/models/message.interface';
import { MessageBody } from '@nestjs/websockets';
import { Observable, from, of } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path'; 
import { Room } from './utils/models/room.interface';
import { join } from 'path/posix';
import { PrivateChatService } from './utils/services/privateChat.service';
import { RoomChatService } from './utils/services/roomChat.service';

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
    constructor(private privateChatService:PrivateChatService, private roomChatService:RoomChatService) {}

  @Post('messages')
  async messages(@Body() msg:Message) {
      this.privateChatService.saveMessage(msg)
      // await this.chatService.trigger('chat', 'message', msg);
      return [];
  }

  @Get('getMessages')
  getMessages() {
    return this.privateChatService.getMessages()
  }

  @Post('getConversation')
  getConversation(@Body() data:any) {
    return this.privateChatService.getConversation(data.senderId, data.receiverId);
  }

  @Post('notReaded')
  notReaded(@Body() id:number) {
    return this.privateChatService.getUnreadMessageCountsBySenderId(id)
  }

  @Get('search')
  async searchConversation(@Query('query') query:string) {
    const users = await this.privateChatService.searchConversation(query);
    return users;
  }

  ////////////////////////////////////////// ROMMS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  @Post('createRoom')
  createRoom(@Body() room:Room) {
    this.roomChatService.createRoom(room);
    return room
  }

  @Get('allRooms')
  getAllRooms() {
    return this.roomChatService.getAllRooms();
  }

  @Get('searchRoom')
  async searchRoom(@Query('query') query:string) {
    const rooms = await this.roomChatService.searchRooms(query);
    return rooms;
  }

  @Post('joinRoom')
  joinRoom(@Body() data:{id:number, room:Room}) {
    this.roomChatService.joinRoom(data.id, data.room)
    return data.room;
  }

  @Post('joinProtected')
  joinProtectedRoom(@Body() data:{id:number, room:Room, password:string}) {
    return this.roomChatService.joinProtected(data.id, data.room, data.password)
  }

  // @Post('roomMembers')
  // getRoomMembers(@Body() room:Room) {
  //   return this.roomChatService.getRoomMembers(room);
  // }

  @Post('updateRoom')
  updateRoom(@Body() room:Room) {
    this.roomChatService.changeRoomType(room);
    return room
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
