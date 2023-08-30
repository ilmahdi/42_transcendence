import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { NotifyService } from './notify.service';
import { JwtGuard } from 'src/auth/utils/guards/jwt.guard';

@Controller('notify')
export class NotifyController {
  constructor(private readonly notifyService: NotifyService) {}


  @UseGuards(JwtGuard)
    @Get('data/:userId')
    async getNotifications(@Param('userId') userId: number) {

      return await this.notifyService.getNotifications(userId); 
    }
}
