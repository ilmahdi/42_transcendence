import { Controller, Get, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtGuard } from "src/auth/utils/guards/jwt.guard";

@Controller('user')
export class UserController {

    constructor (private userService: UserService) {

    }
    @Get("me")
    @UseGuards(JwtGuard)
    getUser() {
        return this.userService.getUserInfo()
    }
    
}