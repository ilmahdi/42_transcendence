import { Body, Controller, Get, Param, ParseEnumPipe, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserAccount } from '@prisma/client';
// import * as bcrypt from "bcryptjs"
import { FtLoginGuard } from './utils/guards/ft-login.guard';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtGuard } from './utils/guards/jwt.guard';



@Controller('auth')
export class AuthController {
    constructor(private readonly authServie: AuthService){
    }
    @Get("login/42")
    @UseGuards(FtLoginGuard)
    ftLogin(){
    }
    
    @Get("callback/42")
    @UseGuards(FtLoginGuard)
    ftCallback(@Req() req){
        console.log(req.user)
        return req.user;
    }
    @Get("logout/42")
    @UseGuards(JwtGuard)
    async ftLogout() {
        return "logged out"
        // return this.authServie.ftLogout()
    }

}
