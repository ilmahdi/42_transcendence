import { PartialType } from '@nestjs/mapped-types';
import { CreateTemporariusDto } from './create-temporarius.dto';

export class UpdateTemporariusDto extends PartialType(CreateTemporariusDto) {}
