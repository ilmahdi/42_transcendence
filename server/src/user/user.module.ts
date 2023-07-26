import { Module } from '@nestjs/common';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth/auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    PrismaModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]

})
export class UserModule {}
