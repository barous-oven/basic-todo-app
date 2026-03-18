import { OmitType } from '@nestjs/mapped-types';
import { ResponseTaskDto } from './response.dto';

export class CreateTaskDto extends OmitType(ResponseTaskDto, [
  'id',
  'createdAt',
  'createdBy',
  'updatedAt',
  'status',
]) {}
