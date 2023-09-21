import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { INotifyData } from './utils/interfaces/notify-data.interface';
import { NotificationCreateDto } from './utils/dtos/create-notification.dto';

@Injectable()
export class NotifyService {
    constructor (
        private readonly prismaService: PrismaService,
    ) {
    }

    async getNotifications(userId :number) {
        const notifications : INotifyData[] = await this.prismaService.notification.findMany({
            select: {
                id: true,                  
                to_id: true,               
                from_id: true,   
                friendship_id: true,                 
                type: true,             
                seen: true,                          
                created_at: true,
                notif_from: {
                    select: {
                      id: true,
                      username: true,
                      avatar: true,
                    },
                },
            },
            where: {
                to_id: userId,
              },
        });
        return notifications;
    }

    async addNotification(notification: NotificationCreateDto) {
      const createdNotification = await this.prismaService.notification.create({
        data: {
          from_id: notification.from_id,
          to_id: notification.to_id,
          type: notification.type,
          friendship_id: notification.friendship_id || 0,
        },
      });
  
      return createdNotification;

    }

    async switchNotification(notification: NotificationCreateDto) {

      const existingNotification = await this.prismaService.notification.findFirst({
        where: {
          from_id: notification.to_id,
          to_id: notification.from_id,
        },
      });

      if (!existingNotification) {
        throw new HttpException('Notification not found', HttpStatus.CONFLICT);
      }

      const createdNotification = await this.prismaService.notification.update({
        where: { 
          id: existingNotification.id, 
        },
        data: {
          from_id: notification.from_id,
          to_id: notification.to_id,
          type: notification.type,
          seen: false,
        },
      });
    
      return createdNotification;

    }
    async deleteNotification(notification: NotificationCreateDto) {
      try {
        const existingNotification = await this.prismaService.notification.findFirst({
          where: {
            OR: [
              {
                from_id: notification.from_id,
                to_id: notification.to_id,
              },
              {
                from_id: notification.to_id,
                to_id: notification.from_id,
              }
            ]
          },
        });

        if (!existingNotification) {
          throw new HttpException('Notification not found', HttpStatus.CONFLICT);
        }

        const createdNotification = await this.prismaService.notification.delete({
          where: { 
            id: existingNotification.id, 
          },
        });
      
        return createdNotification;
      } catch (error) {
        throw new HttpException('Failed to delete notifications', HttpStatus.CONFLICT);
      }

    }

    async deleteNotifications(notificationIds :number[]) {
      try {
        const deletedNotifications = await this.prismaService.notification.deleteMany({
          where: {
            id: { in: notificationIds },
          },
        });
        return deletedNotifications;
      } catch (error) {
        throw new HttpException('Failed to delete notifications', HttpStatus.CONFLICT);
      }
    }
    async deleteGameInviteNotif(notification : {from_id :number}) {
      try {
        const notificationToDelete = await this.prismaService.notification.findFirst({
          where: {
            from_id: notification.from_id,
          },
        });
        if (notificationToDelete) {

          const deletedNotification = await this.prismaService.notification.delete({
            where: {
              id: notificationToDelete.id,
            },
          });
          return deletedNotification;
        }
      } catch (error) {
          console.log('Failed to delete notification!');
      }
    }


    async updateSeenNotifications(notificationIds :number[]) {
      try {
        const deletedNotifications = await this.prismaService.notification.updateMany({
          where: {
            id: {
              in: notificationIds, 
            },
            seen: false, 
          },
          data: {
            seen: true, 
          },
        });
        return deletedNotifications;
      } catch (error) {
        throw new HttpException('Failed to delete notifications', HttpStatus.CONFLICT);
      }
    }













}




