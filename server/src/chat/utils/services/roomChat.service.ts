import { Injectable, NotFoundException } from "@nestjs/common";
import { Room } from "../models/room.interface";
import { Observable, forkJoin, from, map, switchMap } from "rxjs";
import { Message } from "../models/message.interface";
import * as bcrypt from 'bcrypt'
import { UserService } from "src/user/user.service";
import { PrismaService } from "src/prisma/prisma.service";
import { RoomType } from "@prisma/client";
import { UserData } from "src/user/utils/interfaces/user-data.interface";

@Injectable()
export class RoomChatService {
    constructor(
        private userService:UserService,
        private prismaService:PrismaService
    ) {}

    private readonly saltRounds = 10; // Adjust as needed

    async hashPassword(password: string): Promise<string> {
      return bcrypt.hash(password, this.saltRounds);
    }
  
    async comparePasswords(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
      return bcrypt.compare(plainTextPassword, hashedPassword);
    }

    async searchRooms(query: string): Promise<Room[]> {
      const rooms = await this.prismaService.room.findMany({
        where: {
          name: {
            contains: query, // Use Prisma's query builder to filter by name containing the query
          },
        },
      });
  
      return rooms;
    }
  
      async createRoom(room:Room) {
        if (room.password) {
          room.password = await this.hashPassword(room.password)
          return await this.prismaService.room.create({data:{id:room.id, adminId:room.adminId, usersId:room.usersId, name:room.name, password:room.password, type:room.type}})
        }
        else
          return await this.prismaService.room.create({data:{id:room.id, adminId:room.adminId, usersId:room.usersId, name:room.name, password:room.password, type:room.type}})
      }

      getRoomById(id:number){
        let room = this.prismaService.room.findFirst({
          where: {id :id}
        });
        return from(room);
      }

      getAllRooms() {
        const roomsQuery = this.prismaService.room.findMany()
  
        return from(roomsQuery).pipe(
          map(rooms => rooms.filter(room => room.type !== RoomType.PRIVATE))
        );
      }
  
      async getRooms(id: number): Promise<Room[]> {
        try {
          const rooms = await this.prismaService.room.findMany({
            where: {
              OR: [
                { adminId: { hasSome: [id] } }, // Check if id is present in the adminId array
                { usersId: { hasSome: [id] } }, // Check if id is present in the usersId array
              ],
            },
          });
    
          return rooms;
        } catch (error) {
          throw new Error('Could not retrieve rooms');
        }
      }
  
      async getRoomConversation(roomId: number): Promise<Message[]> {
        if (roomId !== -1) {
          try {
            const messages = await this.prismaService.message.findMany({
              where: {
                roomId,
              },
            });
    
            return messages;
          } catch (error) {
            // Handle errors (e.g., database connection errors)
            throw new Error('Could not retrieve messages');
          }
        } else {
          return null;
        }
      }
  
      async getRoomLastMessage(id: number): Promise<Message[]> {
        try {
          // Find rooms where the user with 'id' is an admin or user
          const rooms = await this.prismaService.room.findMany({
            where: {
              OR: [
                { adminId: { hasSome: [id] } }, // Check if 'id' is an admin
                { usersId: { hasSome: [id] } }, // Check if 'id' is a user
              ],
            },
          });
    
          // Find messages sent or received by the user with 'id'
          const messages = await this.prismaService.message.findMany({
            where: {
              OR: [
                { senderId: id },
                { receiverId: id },
              ],
            },
          });
    
          // Filter messages with a valid 'roomId' (not -1)
          const filteredMessages = messages.filter((message) => message.roomId !== -1);
    
          return filteredMessages;
        } catch (error) {
          // Handle errors (e.g., database connection errors)
          throw new Error('Could not retrieve messages');
        }
      }
  
      async getMessagesByUserId(userId: number): Promise<Message[]> {
        try {
          // Find rooms where the user with 'userId' is an admin or user
          const rooms = await this.prismaService.room.findMany({
            where: {
              OR: [
                { adminId: { hasSome: [userId] } }, // Check if 'userId' is an admin
                { usersId: { hasSome: [userId] } }, // Check if 'userId' is a user
              ],
            },
            select: {
              id: true,
            },
          });
    
          const roomIds = rooms.map((room) => room.id);
    
          if (roomIds.length === 0) {
            return []; // Return empty array if no matching rooms found
          }
    
          // Find messages with matching 'roomId' in the list of roomIds
          const messages = await this.prismaService.message.findMany({
            where: {
              roomId: {
                in: roomIds,
              },
            },
          });
    
          return messages;
        } catch (error) {
          // Handle errors (e.g., database connection errors)
          throw new Error('Could not retrieve messages');
        }
      }
  
      async getUnreadedRoomMessages(userId: number): Promise<{ senderId: number; roomId: number; unreadCount: number }[]> {
        // Find rooms where the user with 'userId' is an admin or user
        const rooms = await this.prismaService.room.findMany({
          where: {
            OR: [
              { adminId: { hasSome: [userId] } },
              { usersId: { hasSome: [userId] } },
            ],
          },
          select: {
            id: true,
          },
        });
    
        if (!rooms || rooms.length === 0) {
          return [];
          // throw new NotFoundException('No rooms found for the user.');
        }
    
        const roomIds = rooms.map((room) => room.id);
    
        // Find unread messages count for each room and sender
        const unreadMessages = await this.prismaService.message.groupBy({
          by: ['roomId', 'senderId'],
          _count: true,
          where: {
            roomId: {
              in: roomIds,
            },
            readed: false,
          },
        });
    
        return unreadMessages.map((message) => ({
          senderId: message.senderId,
          roomId: message.roomId,
          unreadCount: message._count,
        }));
      }
  
      async joinRoom(userId: number, room: Room): Promise<void> {
        if (room.type === RoomType.PUBLIC) {
          const users: number[] = [...room.usersId, userId]; // Add the userId to the existing users
          await this.prismaService.room.update({
            where: { id: room.id },
            data: {
              usersId: users,
            },
          });
        }
      }

    async joinProtected(id:number, room:Room, password:string) {
      const isPasswordValid = this.comparePasswords(password, room.password);
      if (isPasswordValid) {
        room.usersId.push(id);
        await this.prismaService.room.create({data:{id:room.id, adminId:room.adminId, usersId:room.usersId, name:room.name, password:room.password, type:room.type}});
        return true;
      }

      return false;
    }

    getRoomMembers(room:Room) {
      const userIds = room.usersId;
      const adminIds = room.adminId;

      const usersWithTypes: Observable<{ user: UserData; type: string }>[] = [];

      userIds.forEach(async id => {
        const userType = adminIds.includes(id) ? 'admin' : 'user';
        const userObservable = this.userService.getUserById(id).pipe(
          map(user => ({ user, type: userType }))
        );
        usersWithTypes.push(userObservable);
      });

      return forkJoin(usersWithTypes);
    }

    async changeRoomType(room:Room) {
      if (room.type !== RoomType.PROTECTED) {
        room.password = null
        this.prismaService.room.create({data:{id:room.id, adminId:room.adminId, usersId:room.usersId, name:room.name, password:room.password, type:room.type}});
      }
      else {
        room.password = await this.hashPassword(room.password)
        this.prismaService.room.create({data:{id:room.id, adminId:room.adminId, usersId:room.usersId, name:room.name, password:room.password, type:room.type}});
      }
    }
}
