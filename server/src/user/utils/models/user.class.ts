import { IsEmail, IsString } from 'class-validator';

export class User {
  id?: number;
  socketId?:string
  firstName?: string;
  lastName?: string;
  @IsEmail()
  email?: string;
  @IsString()
  password?: string;
  imagePath?: string;
}
