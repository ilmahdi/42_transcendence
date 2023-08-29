import { Module } from '@nestjs/common';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth/auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TokenService } from 'src/common/services/token.service';
import { UserGateway } from './user.gateway';
import { ConnectionModule } from 'src/common/gateways/connection.module';

@Module({
  imports: [PrismaModule, ConnectionModule],
  controllers: [UserController],
  providers: [UserService, UserGateway, TokenService],
  exports: [UserService]

})
export class UserModule {}
