import { UserEntity } from "../../../../server/src/user/utils/models/user.entity";

export interface Conversation {
  id?: number;
  users?: UserEntity[];
  lastUpdated?: Date;
}
