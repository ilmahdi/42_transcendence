import { Module } from '@nestjs/common';
import { TemporariusService } from './temporarius.service';
import { TemporariusController } from './temporarius.controller';

@Module({
  controllers: [TemporariusController],
  providers: [TemporariusService]
})
export class TemporariusModule {}
