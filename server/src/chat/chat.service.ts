import { Injectable, NotFoundException } from '@nestjs/common';
import * as Pusher from 'pusher';
import { Observable, from, map, switchMap } from 'rxjs';
import { Message } from './utils/models/message.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from './utils/models/message.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { EventEmitter } from 'events';
import { RoomEntity } from './utils/models/room.entity';
import { Room } from './utils/models/room.interface';
import { UserEntity } from 'src/user/utils/models/user.entity';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(MessageEntity) private readonly messageRepository:Repository<MessageEntity>,
        @InjectRepository(RoomEntity) private readonly roomRepository:Repository<RoomEntity>,
        @InjectRepository(UserEntity) private readonly userRepository:Repository<UserEntity>,
        private authService:AuthService
    ) {}

    saveMessage(message: Message) {
        return from(this.messageRepository.save(message));
    }

    getMessages() {
        return from(this.messageRepository.find())
    }

    getConversation(senderId:number, receiverId:number) {
        try {
            const messages = this.messageRepository.find({
              where: [
                {senderId: senderId, receiverId: receiverId},
                {senderId: receiverId, receiverId: senderId}
              ],
            });
            return from(messages).pipe(map((messages: Message[]) => messages.filter(item => item.roomId === -1)));;
        } catch (error) {
            // Handle errors (e.g., database connection errors)
            throw new Error('Could not retrieve messages');
        }
    }

    getLastMessage(id:number) {
        try {
            const messages = this.messageRepository.find({
              where: [
                {senderId: id},
                {receiverId: id}
              ],
            });
            return from(messages).pipe(map((messages: Message[]) => messages.filter(item => item.roomId === -1)));;
        } catch (error) {
            throw new Error('Could not retrieve messages');
        }
    }

    // updateReaded(receiverId:number, senderId:number) {
    //     const message = this.messageRepository.find({
    //         where: {
    //           senderId: senderId, receiverId: receiverId
    //         },
    //     });
    //     from(message).subscribe(data=>{
    //         data.forEach(data=>{
    //             const msg = {id:data.id, senderId:data.senderId, receiverId:data.receiverId, message:data.message, date:data.date, readed:true}
    //             this.messageRepository.update(msg.id, msg);
    //         })
    //     })
    // }

    updateReaded(message:Message) {
      let msg = {id:message.id, senderId:message.senderId, receiverId:message.receiverId, message:message.message, date:message.date, readed:true}
      this.messageRepository.update(msg.id, msg);
    }

    // getUnreadMessageCountsBySenderId(receiverId: number): Observable<{ senderId: number; unreadCount: number; }[]> {
    //   const query = `
    //     SELECT "senderId", COUNT(*) AS "unreadCount"
    //     FROM "message"
    //     WHERE "receiverId" = $1 AND "readed" = false
    //     GROUP BY "senderId"
    //   `;
  
    //   return from(this.messageRepository.query(query, [receiverId])).pipe(
    //     map(unreadMessages => unreadMessages as { senderId: number; unreadCount: number }[])
    //   );
    // }

    async getUnreadMessageCountsBySenderId(receiverId: number): Promise<{ senderId: number; unreadCount: number }[]> {
      const query = `
        SELECT "senderId", COUNT(*) AS "unreadCount"
        FROM "message"
        WHERE "receiverId" = $1 AND "readed" = false AND "roomId" = -1
        GROUP BY "senderId"
      `;
    
      try {
        const unreadMessages = await this.messageRepository.query(query, [receiverId]);
        return unreadMessages as { senderId: number; unreadCount: number }[];
      } catch (error) {
        console.error('Error querying unread messages:', error);
        throw error; // Re-throw the error to be handled at a higher level
      }
    }

    async searchConversation(query:string) {
      const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.firstName LIKE :query OR user.lastName LIKE :query', { query: `%${query}%` })
      .getMany();

      return users;
    }

    async searchRooms(query:string) {
      const users = await this.roomRepository
      .createQueryBuilder('room')
      .where('room.name LIKE :query', { query: `%${query}%` })
      .getMany();

      return users;
    }
    ///////////////////////////////////////// ROOMS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

    createRoom(room:Room) {
      if (room.password) {
        this.authService.hashPassword(room.password).subscribe(data=> {
          room.password = data;
          return from(this.roomRepository.save(room));
        })
      }
      else
        return from(this.roomRepository.save(room));
    }

    getAllRooms() {
      return from(this.roomRepository.find());
    }

    getRooms(id: number) {
        try {
          const rooms = this.roomRepository
            .createQueryBuilder('room')
            .where(':id = ANY(room.adminId) OR :id = ANY(room.usersId)', { id })
            .getMany();
    
          return from(rooms);
        } catch (error) {
          throw new Error('Could not retrieve rooms');
        }
    }

    getRoomConversation(roomId:number) {
        if (roomId != -1) {
            try {
                const messages = this.messageRepository.find({
                  where: {
                    roomId:roomId
                  },
                });
                return from(messages);
            } catch (error) {
                // Handle errors (e.g., database connection errors)
                throw new Error('Could not retrieve messages');
            }
        }
        else
            return null
    }

    getRoomLastMessage(id:number): Observable<Message[]> {
      try {
        const rooms = this.roomRepository
            .createQueryBuilder('room')
            .where(':id = ANY(room.adminId) OR :id = ANY(room.usersId)', { id })
            .getMany();

        const messages = this.messageRepository.find({
          where: [
            {senderId: id},
            {receiverId: id}
          ],
        });

        return from(messages).pipe(map((messages: Message[]) => messages.filter(item => item.roomId !== -1)));
    } catch (error) {
        throw new Error('Could not retrieve messages');
    }
  }

  getMessagesByUserId(userId: number): Observable<Message[]> {
    return from(
      this.roomRepository
        .createQueryBuilder('room')
        .select('room.id')
        .where(':userId = ANY(room.adminId) OR :userId = ANY(room.usersId)', {
          userId,
        })
        .getMany()
    ).pipe(
      switchMap((rooms: Room[]) => {
        const roomIds = rooms.map(room => room.id);

        if (roomIds.length === 0) {
          return from([]); // Return empty array as an observable if no matching rooms found
        }

        return from(
          this.messageRepository
            .createQueryBuilder('message')
            .where('message.roomId IN (:...roomIds)', { roomIds })
            .getMany()
        );
      })
    );
  }

  async getUnreadedRoomMessages(userId: number): Promise<{senderId:number, roomId: number, unreadCount: number }[]> {
    const rooms = await this.roomRepository.createQueryBuilder('room')
    .where(':userId = ANY(room.adminId) OR :userId = ANY(room.usersId)', { userId })
    .getMany();

    if (!rooms || rooms.length === 0) {
      throw new NotFoundException('No rooms found for the user.');
    }

  const roomIds = rooms.map(room => room.id);

  const unreadMessages = await this.messageRepository
    .createQueryBuilder('message')
    .select('message.roomId', 'roomId')
    .addSelect('message.senderId', 'senderId')
    .addSelect('COUNT(*)', 'unreadCount')
    .where('message.roomId IN (:...roomIds)', { roomIds })
    .andWhere('message.readed = false')
    .groupBy('message.roomId, message.senderId')
    .getRawMany();
    return unreadMessages.map(message => ({
      senderId: message.senderId,
      roomId: message.roomId,
      unreadCount: message.unreadCount,
    }));
  }

}
