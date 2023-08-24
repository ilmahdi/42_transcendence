import { Injectable } from '@nestjs/common';
import * as Pusher from 'pusher';
import { Observable, from, map, switchMap } from 'rxjs';
import { Message } from './utils/models/message.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from './utils/models/message.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { EventEmitter } from 'events';
import { RoomEntity } from './utils/models/room.entity';
import { Room } from './utils/models/room.interface';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(MessageEntity) private readonly messageRepository:Repository<MessageEntity>,
        @InjectRepository(RoomEntity) private readonly roomRepository:Repository<RoomEntity>
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
      let msg = {id:message.id, senderId:message.senderId, receiverId:message.receiverId, message:message.message, date:message.date, readed:true, roomId:-1}
      this.messageRepository.update(msg.id, msg);
    }

    getUnreadMessageCountsBySenderId(receiverId: number): Observable<{ senderId: number; unreadCount: number }[]> {
      const query = `
        SELECT "senderId", COUNT(*) AS "unreadCount"
        FROM "message"
        WHERE "receiverId" = $1 AND "readed" = false
        GROUP BY "senderId"
      `;
  
      return from(this.messageRepository.query(query, [receiverId])).pipe(
        map(unreadMessages => unreadMessages as { senderId: number; unreadCount: number }[])
      );
    }

    ///////////////////////////////////////// ROOMS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

    createRoom(room:Room) {
        return from(this.roomRepository.save(room));
    }

    getRooms(id: number) {
        try {
          const rooms = this.roomRepository
            .createQueryBuilder('room')
            .where('room.adminId = :id OR :id = ANY(room.usersId)', { id })
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
            .where('room.adminId = :id OR :id = ANY(room.usersId)', { id })
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
        .where('room.adminId = :userId OR :userId = ANY(room.usersId)', {
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

}
