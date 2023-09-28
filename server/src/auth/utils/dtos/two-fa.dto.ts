import { IsNumber, IsString } from "class-validator";

export class TowFaDto {
    
    @IsString()
    userToken: string;
}