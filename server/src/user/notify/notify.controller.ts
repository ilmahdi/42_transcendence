import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { NotifyService } from './notify.service';
import { JwtGuard } from 'src/auth/utils/guards/jwt.guard';
import { NotificationCreateDto } from './utils/dtos/create-notification.dto';

@Controller('user/notify')
export class NotifyController {
  constructor(private readonly notifyService: NotifyService) {}


  @UseGuards(JwtGuard)
  @Get('data/:userId')
  async getNotifications(@Param('userId') userId: number) {

    return await this.notifyService.getNotifications(userId); 
  }

  @UseGuards(JwtGuard)
  @Post("add")
  async addNotification(@Body() notification: NotificationCreateDto) {

      const createdNotification = await this.notifyService.addNotification(notification);

      return createdNotification;
  }
  @UseGuards(JwtGuard)
  @Post("switch")
  async switchNotification(@Body() notification: NotificationCreateDto) {

      const createdNotification = await this.notifyService.switchNotification(notification);

      return createdNotification;
  }
  @UseGuards(JwtGuard)
  @Patch("delete")
  async deleteNotification(@Body() notification: NotificationCreateDto) {

      const deletedNotification = await this.notifyService.deleteNotification(notification);

      return deletedNotification;
  }
  @UseGuards(JwtGuard)
  @Patch('deletes')
  async deleteNotifications(@Body() notificationIds: number[]){

    const deletedNotifications = await this.notifyService.deleteNotifications(notificationIds);

    return deletedNotifications;
  }
}
