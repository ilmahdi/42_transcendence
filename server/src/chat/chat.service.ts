import { Injectable } from '@nestjs/common';
import { UpdateChatDto } from './utils/dtos/update-chat.dto';
import { MessageEntity } from './utils/models/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {

  constructor(@InjectRepository(MessageEntity) private readonly messageRepository:Repository<MessageEntity>) {}

  async create(message: MessageEntity) {
    return await this.messageRepository.save(message);
  }

  async getMessages(): Promise<MessageEntity[]> {
    return await this.messageRepository.find();
  }

  findAll() {
    return `This action returns all chat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
