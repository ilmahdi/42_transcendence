import { NotificationType } from "@prisma/client";
import { IsArray, IsEnum, IsNumber, IsOptional } from "class-validator";

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

export class NotificationsArrayDto {
    @IsArray()
    @IsNumber({}, { each: true })
    notificationIds: number[];
}