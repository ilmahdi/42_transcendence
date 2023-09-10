import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { GameModule } from './game/game.module';
import { ConfigModule } from '@nestjs/config';
import { TemporariusModule } from './temporarius/temporarius.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [

    ConfigModule.forRoot({ isGlobal: true }),
    UserModule, PrismaModule, AuthModule, ChatModule, GameModule, TemporariusModule,
  ],
  controllers: [],
  providers: [PrismaService], // Add PrismaService to providers
})
export class AppModule {}
