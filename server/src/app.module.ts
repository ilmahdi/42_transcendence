import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    UserModule, PrismaModule, AuthModule, ChatModule, 
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
