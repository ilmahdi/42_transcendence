import { User } from "./user.model";


export interface Conversation {
  id?: number;
  users?: User[];
  lastUpdated?: Date;
}
