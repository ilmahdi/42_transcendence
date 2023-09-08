import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { JwtGuard } from './guards/jwt.guard';
import { JwtStrategy } from './guards/jwt.strategy';
import { PrismaModule } from 'nestjs-prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    imports: [
        UserModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: {expiresIn: '3600s'}}),
        PrismaModule
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtGuard, JwtStrategy, PrismaService],

})
export class AuthModule {}
