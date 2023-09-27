import { Body, Controller, Get, Param, ParseEnumPipe, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FtLoginGuard } from './utils/guards/ft-login.guard';

import { Request, Response } from "express";
import { JwtGuard } from './utils/guards/jwt.guard';



@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){
    }
    @Get("twofa/ckeck/:userId")
    @UseGuards(JwtGuard)
    twofaCheck(@Param('userId') userId: number) {

        return this.authService.twofaCheck(userId)

    }
    @Get("login/42")
    @UseGuards(FtLoginGuard)
    ftLogin(){0
    }
    // to see later ************************************************//
    @Get("callback/42")
    @UseGuards(FtLoginGuard)
    ftCallback(@Req() req :any, @Res() res :Response){
        // console.log(req.user)
        let queryUserData = "";
        if (req.user.firstLogin === "true")
            queryUserData = `ft_id=${req.user.profile.ft_id}&username=${req.user.profile.username}&avatar=${req.user.profile.avatar}`;
        else 
            queryUserData = `access_token=${req.user.token}`;
        

        res.status(302).redirect(`${process.env.FONTEND_URL}/login?${queryUserData}&first_login=${req.user.firstLogin}`);
    }

    @UseGuards(JwtGuard)
    async ftLogout() {
        return "logged out"
        // return this.authService.ftLogout()
    }
}
