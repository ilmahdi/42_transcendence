import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { GameController } from './game.controller';
import { ConnectionModule } from 'src/common/gateways/connection.module';
import { NotifyModule } from 'src/user/notify/notify.module';

@Module({

  imports: [ConnectionModule, NotifyModule],
  providers: [GameGateway, GameService],
  controllers: [GameController]
})
export class GameModule {}
