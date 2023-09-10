import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { GameModule } from './game/game.module';
import { TemporariusModule } from './temporarius/temporarius.module';

@Module({
  imports: [
    UserModule, PrismaModule, AuthModule, ChatModule, GameModule, TemporariusModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
