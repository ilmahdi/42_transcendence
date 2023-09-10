import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TokenService } from 'src/common/services/token.service';
import { UserGateway } from './user.gateway';
import { ConnectionModule } from 'src/common/gateways/connection.module';
import { NotifyModule } from './notify/notify.module';

@Module({

  imports: [PrismaModule, ConnectionModule, NotifyModule],
  controllers: [UserController],
  providers: [UserService, UserGateway, TokenService],
  exports: [UserService]

})
export class UserModule {}
