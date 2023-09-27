import { Module } from '@nestjs/common';
import { NotifyService } from './notify.service';
import { NotifyController } from './notify.controller';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  imports: [PrismaModule],
  controllers: [NotifyController],
  providers: [NotifyService],
  exports: [NotifyService]
})
export class NotifyModule {}
