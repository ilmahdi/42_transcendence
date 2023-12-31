import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtGuard } from "src/auth/utils/guards/jwt.guard";
import { UserData } from "./utils/interfaces/user-data.interface";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from "./utils/utility/upload-utils";
import { Request, Response } from "express";
import * as fs from 'fs';
import { UpdateUserDto } from "./utils/dtos/update-user.dto";
import { CreateUserDto } from "./utils/dtos/create-user.dto";
import { FrinedshipDto, FrinedshipStatusDto } from "./utils/dtos/friendship.dto";
import { log } from "console";
import { FriendshipStatus } from "@prisma/client";


@Controller('user')
export class UserController {

    constructor (private userService: UserService) {

    }

    @Get("me")
    @UseGuards(JwtGuard)
    getMyData(@Req() req :Request) : any {
        return req.user;

    }

    @Get("short")
    @UseGuards(JwtGuard)
    getMyDataShort(@Req() req :any) : any {
        return {
          id: req.user.id,
          username: req.user.username,
          avatar: req.user.avatar
        };
        
    }
    @Get("short-data/:userId")
    @UseGuards(JwtGuard)
    getUserDataShort(@Param('userId') userId: number) : any {
      const users = this.userService.getUserDataShort(userId);
      return users;
    }

    @UseGuards(JwtGuard)
    @Get("friend-list/:userId")
    async getFiendList(@Param('userId') userId: number) {
        const friendList =  await this.userService.findFiendList(userId);

        return friendList;
    }
    @UseGuards(JwtGuard)
    @Get("all-users")
    async getAllUsers(@Param('userId') userId: number) {
        const allUsers =  await this.userService.getAllUsers();

        return allUsers;
    }

    @UseGuards(JwtGuard)
    @Get("search")
    searchUsers(@Query('q') query: string) { 
      
        const users = this.userService.searchUsers(query);
        return users;
    }


    @Post("avatar/upload")
    @UseInterceptors(
      FileInterceptor('image', {
        storage: diskStorage({
          destination: process.env.UPLOAD_DIR, 
          filename: editFileName,   
        }),
        fileFilter: imageFileFilter,
      }),
      )
      async uploadImage(@UploadedFile() image: Express.Multer.File) {
        
        return { filename: image.filename };
      }

      
      
    @Post("register")
    registerUser(@Body() createUserDto: CreateUserDto) {
      try {
        const token = this.userService.registerUser(createUserDto);
        return token;
        
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw new NotFoundException(error.message);
        }
        throw new Error('Error creating user');
      }
    }
    
    @UseGuards(JwtGuard)
    @Get("data/:username")
    async getUser(@Param('username') username: string) {
        
        const user = await this.userService.findUserByUsernameSafe(username);

       
        return user;
        
    }

    @Get("avatar/:filename")
    getAvatar(@Param('filename') filename: string, @Res() res: Response) {
      const filePath = process.env.UPLOAD_DIR + filename; 

      try {
        const stat = fs.statSync(filePath);
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Type', 'image/jpeg');
        
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
      } catch (error) {
        res.status(404).send('Avatar not found');
      }
    }

    @UseGuards(JwtGuard)
    @Patch("update/:id")
    updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
      
      const token = this.userService.updateUser(id, updateUserDto);
      return token;
    }
    
    @UseGuards(JwtGuard)
    @Post("friends/add")
    async addFriend(@Body() friendship: FrinedshipDto) {

        return await this.userService.addFriend(friendship);        
    }
    @UseGuards(JwtGuard)
    @Patch("friends/update/:friendshipId")
    async updateFriend(@Param('friendshipId') friendshipId: number, @Body() friendship: FrinedshipDto) {

        return await this.userService.updateFriend(friendshipId, friendship);        
    }
    @UseGuards(JwtGuard)
    @Post("friends/check")
    async checkFriendship(@Body() friendship: FrinedshipDto) {

        const existingFriendship = await this.userService.checkFriendship(friendship);
        if (existingFriendship)
          return existingFriendship;

        return { friendship_status: "NONE",  id: -1};

    }
    @UseGuards(JwtGuard)
    @Delete('friends/cancel/:friendshipId')
    async cancelFriend(@Param('friendshipId') friendshipId: number) {

      const deletedFriendship = await this.userService.deleteFriendship(friendshipId);

      return { user_id: deletedFriendship?.user_id, friendship_status: "NONE",  id: -1};

    }
    @UseGuards(JwtGuard)
    @Post('friends/change/:friendshipId')
    async changeFriend(
      @Param('friendshipId') friendshipId: number, 
      @Body() FrinedshipStatusDto: FrinedshipStatusDto) {
      
      const friendship = await this.userService.changeFriendshipStatus(friendshipId, FrinedshipStatusDto.friendship_status);
      return friendship;
      
    }


  
  }
