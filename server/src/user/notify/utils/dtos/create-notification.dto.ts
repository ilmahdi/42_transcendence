import { NotificationType } from "@prisma/client";
import { IsEnum, IsNumber, IsOptional } from "class-validator";

export class NotificationCreateDto {
    
    @IsNumber()
    from_id: number

    @IsNumber()
    to_id: number
    
    @IsOptional()
    @IsEnum(NotificationType)
    type?: NotificationType;
    
    
    @IsOptional()
    @IsNumber()
    friendship_id?: number
}