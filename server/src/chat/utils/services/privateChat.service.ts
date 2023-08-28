import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MessageEntity } from "../models/message.entity";
import { UserEntity } from "src/user/utils/models/user.entity";
import { Repository } from "typeorm";
import { AuthService } from "src/auth/auth.service";
import { from, map } from "rxjs";
import { Message } from "../models/message.interface";

@Injectable()
export class PrivateChatService {
    constructor(
        @InjectRepository(MessageEntity) private readonly messageRepository:Repository<MessageEntity>,
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
}