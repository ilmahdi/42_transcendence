import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Notifications, NotifyData } from './utils/interfaces/notify-data.interface';

@Injectable()
export class NotifyService {
    constructor (
        private readonly prismaService: PrismaService,
    ) {
    }

    async getNotifications(userId :number) {
        const notifications : Notifications[] = await this.prismaService.notification.findMany({
            select: {
                id: true,                  
                to_id: true,               
                from_id: true,             
                type: true,             
                seen: true,                          
                created_at: true,
                // notif_from: {
                //     select: {
                //       username: true,
                //       avatar: true,
                //     },
                // }, // test later
            },
            where: {
                to_id: userId,
              },
        });
        return await this.transformNotifyData(notifications);
    }


    async transformNotifyData(notifications: Notifications[]): Promise<NotifyData[]> {
        const transformedNotifications: NotifyData[] = [];
      
        for (const notification of notifications) {
          const { from_id, ...rest } = notification;
      
          try {
            const user = await this.prismaService.userAccount.findUnique({
              where: { id: from_id },
              select: { username: true, avatar: true },
            });
      
            if (user) {
              transformedNotifications.push({
                ...rest,
                username: user.username,
                avatar: user.avatar,
              });
            }
          } catch (error) {

            throw new HttpException(`Error fetching user data for user ID ${from_id}:`, HttpStatus.CONFLICT);
          }
        }
      
        return transformedNotifications;
      }
}




