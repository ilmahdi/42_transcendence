import { Controller, NotFoundException, Param, Post } from '@nestjs/common';
import { TwoFaService } from './two-fa.service';

@Controller('two-fa')
export class TwoFaController {
  constructor(private readonly twoFaService: TwoFaService) {}





  @Post('enable-twofa/:userId')
  async enableTwoFactorAuth(@Param('userId') userId: number): Promise<{ secretKey: string }> {
    try {
      const secretKey = await this.twoFaService.enableTwoFactorAuth(userId);
      return { secretKey };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }
}
