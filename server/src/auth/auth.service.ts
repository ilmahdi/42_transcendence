import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { Profile } from './utils/interfaces'
import { UserService } from 'src/user/user.service';
import { TokenService } from 'src/common/services/token.service';


@Injectable()
export class AuthService {
    constructor(
            private readonly userService: UserService,
            private tokenService: TokenService,
        ){
    }

    async validateFtUser(profile: Profile){
        try {

            let firstLogin :string = "false";
            // original auth
            // let user = await this.userService.findUserByFtId(profile.ft_id);
            let user = await this.userService.findUserByUsername(profile.username);
            // 
            if (!user)
            {
                // user = await this.userService.addUser(profile);
                firstLogin = "true";
                return { profile, firstLogin }
            }
            const token =  this.tokenService.generateToken(
                {
                    sub: user.id,
                    username: user.username,
                }
                )
                return { token, firstLogin }
         }
         catch {

            throw new UnauthorizedException();
         }
    }

    async twofaCheck(userId :number) {
        return await this.userService.twofaCheck(userId);
    }

    

}