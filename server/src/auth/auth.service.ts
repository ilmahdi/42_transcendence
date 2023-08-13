import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
// import * as bcrypt from "bcryptjs"
import * as jwt from "jsonwebtoken"
import { retry } from 'rxjs';
import { brotliCompress } from 'zlib';
import { Profile } from './utils/interfaces'
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/common/interfaces';


@Injectable()
export class AuthService {
    constructor(
            private readonly userService: UserService,
            private jwtService: JwtService,
        ){
    }

    async validateUser(profile: Profile){
        let firstLogin :string = "false";
        let user = await this.userService.findUserByUsername(profile.username);
        if (!user)
        {
            user = await this.userService.addUser(profile);
            firstLogin = "true";
        }
        const token = await this.generateJwt(
            {
                sub: user.id,
                username: user.username,
            }
        )
        return {token, firstLogin }
    }


    // utility functions: 
    /*************************************************************************/
    async generateJwt(payload: JwtPayload) {
        return await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_SECRET,
          })
      }
}
    















    // async ftLogout () {
    //     const endpoint = 'https://api.intra.42.fr/oauth/revoke';
  
    //     try {
    //         await axios.delete(endpoint, {
    //         headers: {
    //             Authorization: `Bearer ${accessToken}`,
    //         },
    //         });
    //     } catch (error) {
    //         // Handle error if necessary
    //         console.error('Failed to revoke 42 token:', error.message);
    //         throw error;
    //     }
    // }