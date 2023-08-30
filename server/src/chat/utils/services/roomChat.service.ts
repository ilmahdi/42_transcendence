import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MessageEntity } from "../models/message.entity";
import { RoomEntity } from "../models/room.entity";
import { UserEntity } from "src/user/utils/models/user.entity";
import { Repository } from "typeorm";
import { AuthService } from "src/auth/auth.service";
import { Room } from "../models/room.interface";
import { Observable, from, map, switchMap } from "rxjs";
import { RoomType } from "../models/roomType.enum";
import { Message } from "../models/message.interface";
import * as bcrypt from 'bcrypt'
import { UserService } from "src/user/user.service";
import { User } from "src/user/utils/models/user.class";

@Injectable()
export class RoomChatService {
    constructor(
        @InjectRepository(MessageEntity) private readonly messageRepository:Repository<MessageEntity>,
        @InjectRepository(RoomEntity) private readonly roomRepository:Repository<RoomEntity>,
        @InjectRepository(UserEntity) private readonly userRepository:Repository<UserEntity>,
        private authService:AuthService,
        private userService:UserService
    ) {}

    async searchRooms(query:string) {
      let n = 2
        const users = await this.roomRepository
        .createQueryBuilder('room')
        .where('room.name LIKE :query', { query: `%${query}%` })
        .getMany();
  
        return users;
      }
  
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
        const roomsQuery = this.roomRepository.find()
  
        return from(roomsQuery).pipe(
          map(rooms => rooms.filter(room => room.type !== RoomType.PRIVATE))
        );
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
  
    joinRoom(userId:number, room:Room) {
      if (room.type === RoomType.PUBLIC) {
        const users:number[] = []
        room.usersId.forEach(id=> {
          users.push(id)
        })
        users.push(userId)
        this.roomRepository.update(room.id, {usersId:users})
      }
    }

    async joinProtected(id:number, room:Room, password:string) {
      const isPasswordValid = await bcrypt.compare(password, room.password);

      if (isPasswordValid) {
        room.usersId.push(id);
        await this.roomRepository.save(room);
        return true;
      }

      return false;
    }

    getRoomMembers(room:Room) {
      const users = this.userRepository.findByIds(room.usersId)
      return from(users)
    }

    changeRoomType(room:Room, type:RoomType) {
      if (type !== RoomType.PROTECTED) {
        room.type = type
        this.roomRepository.save(room);
      }
      else {
      }
    }
}
