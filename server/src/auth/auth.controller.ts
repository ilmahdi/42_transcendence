import { Body, Controller, Get, Param, ParseEnumPipe, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserEntity } from 'src/user/utils/models/user.entity';
import { Observable, map } from 'rxjs';
import { User } from 'src/user/utils/models/user.interface';
import { JwtGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authServie: AuthService){
    }

    @Post('register')
    register(@Body() user: User): Observable<User> {
        return this.authServie.registerAccount(user);
    }

    @Post('login')
    login(@Body() user: User): Observable<{token:string}> {
        return this.authServie.login(user).pipe(map((jwt: string) => ({token:jwt})))
    }

    @UseGuards(JwtGuard)
    @Get('allUsers')
    getAllUsers() {
        return this.authServie.getAllUsers();
    }
}
