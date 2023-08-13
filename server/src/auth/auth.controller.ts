import { Body, Controller, Get, Param, ParseEnumPipe, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
// import * as bcrypt from "bcryptjs"
import { FtLoginGuard } from './utils/guards/ft-login.guard';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtGuard } from './utils/guards/jwt.guard';



@Controller('auth')
export class AuthController {
    constructor(private readonly authServie: AuthService){
    }
    @Get("hello") 
    testLink() {
        return { 
            msg: "hello form nest",
        }

    }
    @Get("login/42")
    @UseGuards(FtLoginGuard)
    ftLogin(){
    }
    
    @Get("callback/42")
    @UseGuards(FtLoginGuard)
    ftCallback(@Req() req, @Res() res){
        console.log(req.user)
        res.status(302).redirect(`${process.env.FONTEND_URL}?access_token=${req.user.token}&first_login=${req.user.firstLogin}`);
        return req.token;
    }
    @Get("logout/42")
    @UseGuards(JwtGuard)
    async ftLogout() {
        return "logged out"
        // return this.authServie.ftLogout()
    }

}
