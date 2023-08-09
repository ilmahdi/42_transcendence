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
    constructor(
        @InjectRepository(MessageEntity) private readonly messageRepository:Repository<MessageEntity>
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
}
