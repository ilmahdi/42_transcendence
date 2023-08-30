import { NotificationType } from "@prisma/client";

export interface Notifications {
  id: number,                  
  to_id: number,               
  from_id: number,             
  type: NotificationType,                
  seen: Boolean,                          

  created_at: Date,
}

export interface NotifyData {
  id: number,                  
  username: string,               
  avatar: string,             
  type: NotificationType,                
  seen: Boolean,                          

  created_at: Date,
}