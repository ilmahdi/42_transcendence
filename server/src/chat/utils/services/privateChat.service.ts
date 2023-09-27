import { Injectable } from "@nestjs/common";
import { from } from "rxjs";
import { Message } from "../models/message.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { UserModel } from "src/user/utils/interfaces/user.model";
import { Friendship, FriendshipStatus, UserAccount } from "@prisma/client";

@Injectable()
export class PrivateChatService {
    constructor(
        private prismaService:PrismaService,
    ) {}

    async saveMessage(message: Message): Promise<{sent:boolean, message:Message}> {
      let friends:Friendship[] = await this.prismaService.friendship.findMany({
        where: {
          friendship_status: FriendshipStatus.BLOCKED
        }
      })
      let blocked:boolean = false;
      friends.forEach(friend=> {
        if (friend.id === message.senderId) {
          blocked = true;
          return;
        }
      })

      if (blocked)
        return {sent:false, message:null};

      const msg = await this.prismaService.message.create({
        data:{
          senderId:message.senderId,
          date:message.date,
          message:message.message,
          receiverId:message.receiverId,
          readed:false,
          roomId:message.roomId,
        },
        include: {sender: true, receiver: true}
      })

      return {sent:true, message:msg};
    }

    getMessages() {
        return from(this.prismaService.message.findMany())
    }

    async getConversation(senderId: number, receiverId: number): Promise<Message[]> {
      try {
        const messages = await this.prismaService.message.findMany({
          where: {
            OR: [
              { senderId: senderId, receiverId: receiverId },
              { senderId: receiverId, receiverId: senderId },
            ],
          },
        });
  
        // Filter messages with a valid 'roomId' (not -1)
        const filteredMessages = messages.filter((message) => message.roomId === -1);
  
        return filteredMessages;
      } catch (error) {
        // Handle errors (e.g., database connection errors)
        throw new Error('Could not retrieve messages');
      }
    }

    async getLastMessage(id: number): Promise<Message[]> {
      try {
        const messages = await this.prismaService.message.findMany({
          where: {
            OR: [
              { senderId: id },
              { receiverId: id },
            ],
          },
        });
  
        // Filter messages with a valid 'roomId' (not -1)
        const filteredMessages = messages.filter((message) => message.roomId === -1);
  
        return filteredMessages;
      } catch (error) {
        // Handle errors (e.g., database connection errors)
        throw new Error('Could not retrieve messages');
      }
    }

    async updateRead(message: Message): Promise<void> {
      const updatedMessage = await this.prismaService.message.update({
        where: { id: message.id },
        data: {
          readed: true,
        },
      });
    }

    async getUnreadMessageCountsBySenderId(receiverId: number): Promise<{ senderId: number; unreadCount: number }[]> {
      try {
        // Retrieve all relevant messages
        const messages = await this.prismaService.message.findMany({
          where: {
            receiverId: receiverId,
            readed: false,
            roomId: -1,
          },
          select: {
            senderId: true,
          },
        });
  
        // Count unread messages for each sender using JavaScript
        const unreadCounts = messages.reduce((countMap, message) => {
          const senderId = message.senderId;
          countMap.set(senderId, (countMap.get(senderId) || 0) + 1);
          return countMap;
        }, new Map<number, number>());
  
        // Convert the map to an array of { senderId, unreadCount }
        const result = Array.from(unreadCounts).map(([senderId, unreadCount]) => ({
          senderId,
          unreadCount,
        }));
  
        return result;
      } catch (error) {
        console.error('Error querying unread messages:', error);
        throw error;
      }
    }

    async searchConversation(query: string): Promise<UserModel[]> {
      try {
        const users = await this.prismaService.userAccount.findMany({
          where: {
              username: { contains: query, mode: 'insensitive' }
          },
        });
  
        return users;
      } catch (error) {
        console.error('Error searching conversation:', error);
        throw error;
      }
    }

    async getAllConversations(id:number) {
      try {
        const messages = await this.prismaService.message.findMany({
          where: {
            OR: [
              { senderId: id },
              { receiverId: id }
            ]
          },
          include: {
            sender: true,
            receiver: true
          }
        })
        
        let users:UserModel[] = [];
        messages.forEach(msg=> {
          if (msg.senderId === id) {
            // const usr:UserModel = {}
            users.push({id:msg.receiver.id, username:msg.receiver.username, avatar:msg.receiver.avatar});
          }
          else
            users.push({id:msg.sender.id, username:msg.sender.username, avatar:msg.sender.avatar});
        })

        const friendship = await this.prismaService.friendship.findMany({
          where: {
            OR: [
              {user_id: id},
              {friend_id: id}
            ]
          },
          include: {friend:true, user: true}
        })

        let friends:UserModel[] = []
        friendship.forEach(item=> {
          friends.push(item.friend)
          friends.push(item.user)
        })

        users = users.concat(friends)

        return users;
      } catch (error) {
        console.error('Error searching conversations:', error);
        throw error;
      }
    }
}
