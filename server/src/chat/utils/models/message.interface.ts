import { UserEntity } from 'src/user/utils/models/user.entity';
import { Conversation } from './conversation.interface';

export interface Message {
  id?: number;
  message?: string;
  user?: UserEntity;
  conversation: Conversation;
  createdAt?: Date;
}
