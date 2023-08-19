import { Body, Controller, Get, NotFoundException, Param, Patch, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
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


@Controller('user')
export class UserController {

    constructor (private userService: UserService) {

    }

    @UseGuards(JwtGuard)
    @Get("me")
    getMyData(@Req() req :Request) : any {
        // console.log(req.user)
        return req.user;
        
    }
    @UseGuards(JwtGuard)
    @Get(":username")
    getUser(@Param('username') username: string) : any {
        
        return this.userService.findUserByUsername(username);
        
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
      @Patch("/:id")
      updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
        try {
          const token = this.userService.updateUser(id, updateUserDto);
          return token;
        
        } catch (error) {
          if (error instanceof NotFoundException) {
            throw new NotFoundException(error.message);
          }
          throw new Error('Error updating user');
        }
    }
    
    
  }
