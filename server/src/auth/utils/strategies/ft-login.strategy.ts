import { Strategy } from "passport-42";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../auth.service';
import { Profile } from '../interfaces'
 

@Injectable()
 export class FtLoginSrategy  extends PassportStrategy(Strategy, "42") {
    constructor(private readonly authService: AuthService) {
        super({
            clientID: process.env.PASSPORT_CLIENT_ID,
            clientSecret: process.env.PASSPORT_CLIENT_SECRET,
            callbackURL: process.env.PASSPORT_CALLBACK_URL,
        });
      }
      
      async validate(accessToken: string, refreshToken: string, profile: any, done: any) {
        
        const miniProfile: Profile = {
          ft_id: profile._json.id,
          username: profile._json.login,
          email: profile._json.email,
          avatar: profile._json.image!.link,
        }
        
        const user = await this.authService.validateFtUser(miniProfile);
        if (!user) {
          throw new UnauthorizedException();
        }
        done(null, user);
      }
 }
