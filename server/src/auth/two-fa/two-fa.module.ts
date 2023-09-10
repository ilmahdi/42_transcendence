import { Module } from '@nestjs/common';
import { TwoFaService } from './two-fa.service';
import { TwoFaController } from './two-fa.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [TwoFaController],
  providers: [TwoFaService],
  imports: [
    UserModule,
],
})
export class TwoFaModule {}
