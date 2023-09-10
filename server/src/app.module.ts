import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ChatModule } from './chat/chat.module';
import { GameModule } from './game/game.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule, // Include PrismaModule
    UserModule,
    AuthModule,
    ChatModule,
    GameModule,
  ],
  controllers: [],
  providers: [PrismaService], // Add PrismaService to providers
})
export class AppModule {}
