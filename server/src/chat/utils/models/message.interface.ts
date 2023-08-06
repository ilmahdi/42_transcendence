import { UserEntity } from 'src/user/utils/models/user.entity';

export interface Message {
  id?: number;
  username?:string;
  message?: string;
}
