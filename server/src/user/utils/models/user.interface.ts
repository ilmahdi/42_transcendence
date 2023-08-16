import { IsEmail, IsString } from "class-validator";

export interface User {
  id?: number;
  // socketId?:string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  imagePath?: string;
}