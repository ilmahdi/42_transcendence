import { Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
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
      const originalname = file.originalname 
      const filename: string = path.parse(originalname).name.replace(/\s/g, '');
      const extension: string = path.parse(originalname).ext;

      cb(null, `${filename}${extension}`)
    }
  })
}

@Controller('chat')
export class ChatController {
    constructor(private privateChatService:PrivateChatService, private roomChatService:RoomChatService) {}

  @Get('search')
  async searchConversation(@Query('query') query:string) {
    try {
      const users = await this.privateChatService.searchConversation(query);
      return users;
    } catch {
      throw new HttpException('Error searching', HttpStatus.BAD_REQUEST)
    }
  }

  ////////////////////////////////////////// ROMMS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  @Post('createRoom')
  async createRoom(@Body() room:Room) {
    try {
      const newRoom:Room = await this.roomChatService.createRoom(room);
      return newRoom
    } catch {
      throw new HttpException('can not create room', HttpStatus.NOT_ACCEPTABLE);
    }
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
  async joinProtectedRoom(@Body() data:{id:number, room:Room, password:string}) {
    return await this.roomChatService.joinProtected(data.id, data.room, data.password)
  }

  @Get("allUsers")
  getAllUsers() {
    return this.roomChatService.getAllUsers()
  }

  ////////////////////////////////////////// UPLOAD IMAE \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', storage))
  uploadFile(@UploadedFile() file): Observable<string> {
    if (file)
      return from(file.filename as string);
  }

  @Get('image/:imagePath')
  findImage(@Param('imagePath') imagePath, @Res() res) {
    return of(res.sendFile(join(process.cwd(), 'uploads/images/' + imagePath)));
  }
}
