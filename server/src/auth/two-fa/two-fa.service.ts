import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TwoFaService {

    constructor(
        private readonly userService: UserService,
        ) {}

    async enableTwoFactorAuth(userId: number): Promise<string> {
        const user = await this.userService.findUserById(userId)
    
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
    
        if (user.is_tfa_enabled) {
            throw new HttpException('twoFA is already enabled for this user', HttpStatus.CONFLICT);
        }
    
        const secretKey = this.generateSecretKey();
    
        await this.userService.updateUserAny(userId, {
            tfa_secret: secretKey,
            is_tfa_enabled: true,
        });
    
        return secretKey;
      }
    

    generateSecretKey(): string {
        const secret = speakeasy.generateSecret({ length: 32 });
        return secret.base32;
    }
}
