import { NotificationType } from "@prisma/client";

export interface INotifyData {
   id: number,                  
    type: string,                
    seen: Boolean,   
    friendship_id?: number,                       
    notif_from : {
      id: number
      username: string,               
      avatar: string,
    }       
    created_at: Date,
}



