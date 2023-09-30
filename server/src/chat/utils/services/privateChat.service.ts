import { BadRequestException, Injectable } from '@nestjs/common';
import { from } from 'rxjs';
import { Message } from '../models/message.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserModel } from 'src/user/utils/interfaces/user.model';
import { Friendship, FriendshipStatus, UserAccount } from '@prisma/client';

@Injectable()
export class PrivateChatService {
  constructor(private prismaService: PrismaService) {}

  async saveMessage(
    message: Message,
  ): Promise<{ sent: boolean; message: Message }> {
    try {
      // throw 'error';
      let friends: Friendship[] = await this.prismaService.friendship.findMany({
        where: {
          friendship_status: FriendshipStatus.BLOCKED,
        },
      });
      let blocked: boolean = false;
      friends.forEach((friend) => {
        if (
          friend.friend_id === message.senderId ||
          friend.friend_id === message.receiverId
        ) {
          blocked = true;
          return { sent: false, message: null };
        }
      });

      if (blocked) return { sent: false, message: null };

      const msg = await this.prismaService.message.create({
        data: {
          senderId: message.senderId,
          date: message.date,
          message: message.message,
          receiverId: message.receiverId,
          readed: false,
          roomId: message.roomId,
        },
        // include: {sender: true, receiver: true}
      });

      return { sent: true, message: msg };
    } catch {

       throw new BadRequestException('Could not retrieve messages');
    }
  }

  getMessages() {
    return from(this.prismaService.message.findMany());
  }

  async getConversation(
    senderId: number,
    receiverId: number,
  ): Promise<Message[]> {
    try {
      const messages = await this.prismaService.message.findMany({
        where: {
          OR: [
            { senderId: senderId, receiverId: receiverId },
            { senderId: receiverId, receiverId: senderId },
          ],
        },
        include: { sender: true, receiver: true },
      });

      // Filter messages with a valid 'roomId' (not -1)
      let filteredMessages = messages.filter(
        (message) => message.roomId === -1,
      );

      // Get the status between the sender and receiver of the messages
      const user = await this.prismaService.userAccount.findFirst({
        where: { id: receiverId },
        include: { friendship_from: true, friendship_to: true },
      });

      let blockedId: number = -1;
      user.friendship_from.forEach((data) => {
        if (
          (data.friend_id === senderId || data.friend_id === receiverId) &&
          data.friendship_status === FriendshipStatus.BLOCKED
        )
          if (data.friend_id != senderId) blockedId = data.friend_id;
      });
      user.friendship_to.forEach((data) => {
        if (
          (data.friend_id === senderId || data.friend_id === receiverId) &&
          data.friendship_status === FriendshipStatus.BLOCKED
        )
          if (data.friend_id != senderId) blockedId = data.friend_id;
      });

      // Filter the messages which are from a blocked user
      filteredMessages = filteredMessages.filter(
        (msg) => msg.senderId !== blockedId,
      );

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
          OR: [{ senderId: id }, { receiverId: id }],
        },
      });

      // Filter messages with a valid 'roomId' (not -1)
      const filteredMessages = messages.filter(
        (message) => message.roomId === -1,
      );

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

  async getUnreadMessageCountsBySenderId(
    receiverId: number,
  ): Promise<{ senderId: number; unreadCount: number }[]> {
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
      const result = Array.from(unreadCounts).map(
        ([senderId, unreadCount]) => ({
          senderId,
          unreadCount,
        }),
      );

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
          username: { contains: query, mode: 'insensitive' },
        },
      });

      return users;
    } catch (error) {
      throw error;
    }
  }

  async getAllConversations(id: number) {
    try {
      const messages = await this.prismaService.message.findMany({
        where: {
          OR: [{ senderId: id }, { receiverId: id }],
        },
        include: {
          sender: true,
          receiver: true,
        },
      });

      let users: UserModel[] = [];
      messages.forEach((msg) => {
        if (msg.senderId === id) {
          // const usr:UserModel = {}
          users.push({
            id: msg.receiver.id,
            username: msg.receiver.username,
            avatar: msg.receiver.avatar,
          });
        } else
          users.push({
            id: msg.sender.id,
            username: msg.sender.username,
            avatar: msg.sender.avatar,
          });
      });

      const friendship = await this.prismaService.friendship.findMany({
        where: {
          OR: [{ user_id: id }, { friend_id: id }],
        },
        include: { friend: true, user: true },
      });

      let friends: UserModel[] = [];
      friendship.forEach((item) => {
        friends.push(item.friend);
        friends.push(item.user);
      });

      users = users.concat(friends);

      return users;
    } catch (error) {
      console.error('Error searching conversations:', error);
      throw error;
    }
  }
}
