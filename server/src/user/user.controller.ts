import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtGuard } from "src/auth/utils/guards/jwt.guard";
import { UserData } from "./utils/interfaces/user-data.interface";

@Controller('user')
export class UserController {

    constructor (private userService: UserService) {

    }
    @Get("me")
    @UseGuards(JwtGuard)
    getUser(@Req() req) : UserData {
        console.log(req.user)
        return req.user;
    }
    
}