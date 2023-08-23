import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { FtLoginSrategy } from './utils/strategies/ft-login.strategy';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { JwtStrategy } from './utils/strategies/jwt.strategy';
import { TokenService } from 'src/common/services/token.service';

@Module({
    imports: [
        PassportModule,
        UserModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, FtLoginSrategy, JwtStrategy, TokenService],

})
export class AuthModule {}
