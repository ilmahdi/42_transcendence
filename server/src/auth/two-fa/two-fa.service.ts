import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as qrcode from 'qrcode';
import * as speakeasy from 'speakeasy';


@Injectable()
export class TwoFaService {

    constructor(
        private readonly userService: UserService,
        ) {}

    async generateTwoFa(userId: number): Promise<any> {
        const user = await this.userService.findUserById(userId)
    
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
    
        if (user.is_tfa_enabled) {
            throw new HttpException('twoFA is already enabled for this user', HttpStatus.CONFLICT);
        }
    
        const secretKey = this.generateSecretKey();
        const otpauthUrl = this.generateOtpauthUrl(user.username, 'Transcendence', secretKey.ascii);
    
        const updatedUser = await this.userService.updateUserAny(userId, {
            tfa_secret: secretKey.base32,
        });

        const qrCodeBuffer = await qrcode.toDataURL(otpauthUrl);
    
        return {
            qr_code: qrCodeBuffer,
            tfa_secret: updatedUser.tfa_secret,
        };
    }

    async enableTwoFa(userId: number, userToken: string): Promise<any> {
        const user = await this.userService.findUserById(userId)
    
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
    
        if (user.is_tfa_enabled) {
            throw new HttpException('twoFA is already enabled for this user', HttpStatus.CONFLICT);
        }

    
        const isValid = this.validateTwoFaToken(user.tfa_secret, userToken);

        if (isValid) {
            await this.userService.updateUserAny(userId, {
                is_tfa_enabled: true,
            });
        }

        return {
            is_tfa_enabled : isValid
        };
    }
    
    async validateTwoFa(userId: number, userToken: string): Promise<any> {
        const user = await this.userService.findUserById(userId)
    
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
    
        if (!user.is_tfa_enabled) {
            throw new HttpException('twoFA is not enabled for this user', HttpStatus.CONFLICT);
        }
    
        const isValid = this.validateTwoFaToken(user.tfa_secret, userToken);

        return {
            is_tfa_validated : isValid
        };

    }



    async disableTwoFa(userId: number): Promise<any> {
        const user = await this.userService.findUserById(userId)
    
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
    
        if (!user.is_tfa_enabled) {
            throw new HttpException('twoFA is not enabled for this user', HttpStatus.CONFLICT);
        }
    
    
        const updatedUser = await this.userService.updateUserAny(userId, {
            tfa_secret: null,
            is_tfa_enabled: false,
        });
        
        return {
            is_tfa_enabled: updatedUser.is_tfa_enabled,
        };

    }
    
    // private functions
    /*********************************************/
    generateSecretKey() : speakeasy.GeneratedSecret {

        const secretKey = speakeasy.generateSecret({ length: 32 });
    
        return secretKey;;
      
    }
    generateOtpauthUrl(username: string, issuer: string, secret: string): string {
        return speakeasy.otpauthURL({
          secret: secret,
          label: username,
          issuer: issuer,
        });
    }
    validateTwoFaToken(secret: string, token: string): boolean {
        return speakeasy.totp.verify({
          secret: secret,
          encoding: 'base32',
          token: token,
        });
    }
}
