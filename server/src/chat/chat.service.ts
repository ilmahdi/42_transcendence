import { Injectable } from '@nestjs/common';
import * as Pusher from 'pusher';
import { Observable, from } from 'rxjs';
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
            return from(messages);
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
            return from(messages);
        } catch (error) {
            throw new Error('Could not retrieve messages');
        }
    }

    updateReaded(receiverId:number, senderId:number) {
        const message = this.messageRepository.find({
            where: {
              senderId: senderId, receiverId: receiverId
            },
        });
        from(message).subscribe(data=>{
            data.forEach(data=>{
                const msg = {id:data.id, senderId:data.senderId, receiverId:data.receiverId, message:data.message, date:data.date, readed:true}
                this.messageRepository.update(msg.id, msg);
            })
        })
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
}
