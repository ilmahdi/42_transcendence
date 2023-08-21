import { IsNumber, IsString } from "class-validator";

export class CreateUserDto {
    
    @IsNumber()
    ft_id: number

    @IsString()
    username: string;
  
    @IsString()
    avatar: string;
}