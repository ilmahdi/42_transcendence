import { UserEntity } from '../../../../server/src/user/utils/models/user.entity';
import { Conversation } from './Conversation';

export interface Message {
    id?: number;
    message?: string;
    user?: UserEntity;
    conversation?: Conversation;
    createdAt?: Date;
}