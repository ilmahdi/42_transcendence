import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateChatDto extends PartialType(CreateUserDto) {
  id: number;
}
