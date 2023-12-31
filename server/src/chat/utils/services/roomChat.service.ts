import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Room } from '../models/room.interface';
import { Observable, forkJoin, from, map, switchMap } from 'rxjs';
import { Message } from '../models/message.interface';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { FriendshipStatus, Mute, RoomType } from '@prisma/client';
import { UserModel } from 'src/user/utils/interfaces/user.model';

@Injectable()
export class RoomChatService {
  constructor(
    private userService: UserService,
    private prismaService: PrismaService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async comparePasswords(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }

  async saveMessage(data: { senderId: number; room: Room; message: Message }) {
    let out: boolean = false;

    for (const item of data.room.mutes) {
      if (item.userId === data.message.senderId) {
        const then: Date = new Date(item.updatedAt);
        const now: Date = new Date();

        const timeDifference = now.getTime() - then.getTime();

        if (timeDifference < item.during * 60000) {
          out = true;
          break;
        }
      }
    }
    
    if (out) {
      return false;
    }

    await this.prismaService.message.create({
      data: {
        senderId: data.message.senderId,
        date: data.message.date,
        message: data.message.message,
        receiverId: data.message.receiverId,
        readed: false,
        roomId: data.message.roomId,
      },
    });

    return true;
  }

  getAllUsers() {
    return from(this.prismaService.userAccount.findMany());
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

  async createRoom(room: Room) {
    try {
      if (room.password) room.password = await this.hashPassword(room.password);
      // if (!room.imagePath)
      //   return
      return await this.prismaService.room.create({
        data: {
          id: room.id,
          adminId: room.adminId,
          usersId: room.usersId,
          name: room.name,
          password: room.password,
          type: room.type,
          imagePath: room.imagePath,
          mutes: { create: [] },
        },
      });
    } catch (error) {
      throw new Error('Could not create room');
    }
  }

  getRoomById(id: number) {
    let room = this.prismaService.room.findFirst({
      where: { id: id },
      include: {
        mutes: true,
      },
    });
    return from(room);
  }

  async getAllRooms(id: number) {
    const roomsQuery = await this.prismaService.room.findMany();

    let otherRooms: Room[] = [];
    roomsQuery.forEach((room) => {
      if (room.type != RoomType.PRIVATE && !room.blackList.includes(id))
        otherRooms.push(room);
    });
    return otherRooms;
  }

  async getRooms(id: number): Promise<Room[]> {
    try {
      const rooms: Room[] = await this.prismaService.room.findMany({
        where: {
          OR: [
            { adminId: { hasSome: [id] } }, // Check if id is present in the adminId array
            { usersId: { hasSome: [id] } }, // Check if id is present in the usersId array
          ],
        },
        include: {
          mutes: true, // Include the associated mutes
        },
      });
      
      return rooms;
    } catch (error) {
      throw new Error('Could not retrieve rooms');
    }
  }

  async getRoomConversation(data:{room:Room, id:number}): Promise<Message[]> {
    if (data.room.id !== -1) {
      try {
        const messages = await this.prismaService.message.findMany({
          where: {
            roomId: data.room.id,
          },
        });

        const room = await this.prismaService.room.findFirst({
          where: { id: data.room.id }
        })

        // GET JUST THE MESSAGES OF ACTUAL ROOM MEMBERS
        let actuallMsgs:Message[] = []
        messages.forEach(msg=> {
          if (room.usersId.includes(msg.senderId))
            actuallMsgs.push(msg)
        })

        const user = await this.prismaService.userAccount.findFirst({
          where: {id: data.id},
          include: {friendship_from: true, friendship_to: true}
        })

        let blackList:number[] = []
        user.friendship_from.forEach(item=> {
          if (item.friendship_status === FriendshipStatus.BLOCKED && item.friend_id !== data.id)
            blackList.push(item.friend_id)
        })
        user.friendship_to.forEach(item=> {
          if (item.friendship_status === FriendshipStatus.BLOCKED && item.friend_id !== data.id) {
            blackList = blackList.filter(id=> id != item.friend_id)
            blackList.push(item.friend_id)
          }
        })
        
        blackList.forEach(id=> {
          actuallMsgs = actuallMsgs.filter(msg=> msg.senderId != id)
        })

        return actuallMsgs;
      } catch (error) {
        throw new Error('Could not retrieve messages');
      }
    } else {
      return null;
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
      let messages = await this.prismaService.message.findMany({
        where: {
          roomId: {
            in: roomIds,
          },
        },
      });

      // Filter the messages from the blocked users
      const user = await this.prismaService.userAccount.findFirst({
        where: {id: userId},
        include: {friendship_from: true, friendship_to: true}
      })

      let blackList:number[] = []
      user.friendship_from.forEach(item=> {
        if (item.friendship_status === FriendshipStatus.BLOCKED && item.friend_id !== userId)
          blackList.push(item.friend_id)
      })
      user.friendship_to.forEach(item=> {
        if (item.friendship_status === FriendshipStatus.BLOCKED && item.friend_id !== userId) {
          blackList = blackList.filter(id=> id != item.friend_id)
          blackList.push(item.friend_id)
        }
      })
      
      blackList.forEach(id=> {
        messages = messages.filter(msg=> msg.senderId != id)
      })

      return messages;
    } catch (error) {
      throw new Error('Could not retrieve messages');
    }
  }

  async getUnreadedRoomMessages(
    userId: number,
  ): Promise<{ senderId: number; roomId: number; unreadCount: number }[]> {
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
    // CHECK IF THE ROOM TYPE HAS NOT BEEN CHANGED BEFORE JOINING
    let actualRoom = await this.prismaService.room.findFirst({
      where: { id: room.id },
    });
    if (actualRoom.type !== room.type) return;

    if (room.type === RoomType.PUBLIC) {
      const users: number[] = [...room.usersId, userId]; // Add the userId to the existing users
      await this.prismaService.room.update({
        where: { id: room.id},
        data: {
          usersId: users,
        },
      });
    }
  }

  async joinProtected(id: number, room: Room, password: string) {
    // CHECK IF THE ROOM TYPE HAS NOT BEEN CHANGED BEFORE JOINING
    let actualRoom = await this.prismaService.room.findFirst({
      where: { id: room.id },
    });
    if (actualRoom.type !== room.type) return;

    const isPasswordValid: boolean = await this.comparePasswords(
      password,
      room.password,
    );

    if (isPasswordValid) {
      await this.prismaService.room.update({
        where: { id: room.id },
        data: {
          usersId: { push: id },
        },
      });
      return true;
    }
    return false;
  }

  async getRoomMembers(
    room: Room,
  ): Promise<{ user: UserModel; type: string }[]> {
    try {
      const updatedRoom = await this.prismaService.room.findFirst({
        where: { id: room.id },
      });

      const userIds = updatedRoom.usersId;
      const adminIds = updatedRoom.adminId;

      const usersWithTypes: Observable<{ user: UserModel; type: string }>[] = [];

      userIds.forEach(async (id) => {
        const userType = adminIds.includes(id) ? 'admin' : 'user';
        const userObservable = this.userService
          .getUserById(id)
          .pipe(map((user) => ({ user, type: userType })));
        usersWithTypes.push(userObservable);
      });

      const result = await forkJoin(usersWithTypes).toPromise();
      return result;
    } catch (error) {
      throw Error(error)
    }
  }

  async changeRoomType(data: {room:Room, withPasswd:boolean}) {
    if (data.room.type !== RoomType.PROTECTED) {
      data.room.password = null;
    }
    else if (data.withPasswd) {
      data.room.password = await this.hashPassword(data.room.password);
    }

    // Iterate through the room's mute entries
    for (const mute of data.room.mutes) {
      // Check if a mute entry with the same roomId and userId exists
      const existingMute = await this.prismaService.mute.findFirst({
        where: {
          roomId: mute.roomId,
          userId: mute.userId,
        },
      });

      if (existingMute) {
        // Mute entry exists, update it
        await this.prismaService.mute.update({
          where: {
            id: existingMute.id, // Use the existing mute's ID for updating
          },
          data: {
            during: mute.during,
          },
        });
      } else {
        // Mute entry doesn't exist, create a new one
        await this.prismaService.mute.create({
          data: {
            roomId: mute.roomId,
            userId: mute.userId,
            during: mute.during,
          },
        });
      }
    }

    // Finally, update the room
    await this.prismaService.room.update({
      where: { id: data.room.id },
      data: {
        id: data.room.id,
        adminId: data.room.adminId,
        usersId: data.room.usersId,
        name: data.room.name,
        password: data.room.password,
        type: data.room.type,
        imagePath: data.room.imagePath,
        blackList: data.room.blackList,
      },
    });
  }

  async getBlacklist(sender:number, receiver:number) {
    const user = await this.prismaService.userAccount.findFirst({
      where: {id: receiver},
      include: {friendship_from: true, friendship_to: true}
    })

    let blackList:number[] = []
    user.friendship_from.forEach(item=> {
      if (item.friendship_status === FriendshipStatus.BLOCKED)
        blackList.push(item.friend_id)
    })
    user.friendship_to.forEach(item=> {
      if (item.friendship_status === FriendshipStatus.BLOCKED) {
        blackList = blackList.filter(id=> id != item.friend_id)
        blackList.push(item.friend_id)
      }
    })

    if (blackList.includes(sender))
      return true
    return false
  }
}
