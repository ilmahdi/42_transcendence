import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { FtLoginSrategy } from './utils/strategies/ft-login.strategy';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { JwtStrategy } from './utils/strategies/jwt.strategy';

@Module({
    imports: [
        JwtModule.register({}),
        PassportModule,
        UserModule
    ],
    controllers: [AuthController],
    providers: [AuthService, FtLoginSrategy, JwtStrategy],

})
export class AuthModule {}
