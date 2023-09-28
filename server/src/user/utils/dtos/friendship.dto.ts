import { FriendshipStatus } from "@prisma/client";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class FrinedshipDto {
    
    @IsNumber()
    user_id: number

    @IsNumber()
    friend_id: number

    @IsOptional()
    @IsEnum(FriendshipStatus)
    friendship_status?: FriendshipStatus;
}

export class FrinedshipStatusDto {

    @IsEnum(FriendshipStatus)
    friendship_status: FriendshipStatus;

}