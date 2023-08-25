import { IsNumber } from "class-validator";

export class FrinedshipDto {
    
    @IsNumber()
    user_id: number

    @IsNumber()
    friend_id: number
}