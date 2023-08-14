import { UserEntity } from 'src/user/utils/models/user.entity';

export interface Message {
  id?: number;
  senderId?:number;
  receiverId?:number;
  message?: string;
  date?:Date
}
