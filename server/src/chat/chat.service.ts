import { Injectable } from '@nestjs/common';
import * as Pusher from 'pusher';
import { from } from 'rxjs';
import { Message } from './utils/models/message.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from './utils/models/message.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class ChatService {
  pusher:Pusher;

    constructor(
        @InjectRepository(MessageEntity) private readonly messageRepository:Repository<MessageEntity>
    ) {
        this.pusher = new Pusher({
           appId: "1644587",
           key: "a7ecfcc0f67ed4def5ba",
           secret: "d0cfe804c7951f5b77ae",
           cluster: "eu",
           useTLS: true
        });          
    }

    async trigger(channel:string, event:string, data:any) {
        await this.pusher.trigger(channel, event, data);   
    }

    saveMessage(message: Message) {
        return from(this.messageRepository.save(message));
    }

    getMessages() {
        return from(this.messageRepository.find())
    }

    async getConversation(senderId:number, receiverId:number) {
        try {
            const messages = await this.messageRepository.find({
              where: [
                {senderId: senderId, receiverId: receiverId},
                {senderId: receiverId, receiverId: senderId}
              ],
            });

            return messages;
        } catch (error) {
            // Handle errors (e.g., database connection errors)
            throw new Error('Could not retrieve messages');
        }
    }
}
