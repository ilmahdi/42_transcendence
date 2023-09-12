import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { JwtStrategy } from './utils/strategies/jwt.strategy';
import { TokenService } from 'src/common/services/token.service';
import { TwoFaModule } from './two-fa/two-fa.module';
import { FtLoginSrategy } from './utils/strategies/ft-login.strategy';

@Module({
    imports: [
        PassportModule,
        UserModule,
        TwoFaModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, FtLoginSrategy, JwtStrategy, TokenService],

})
export class AuthModule {}
