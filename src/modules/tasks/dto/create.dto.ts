import { PickType } from '@nestjs/mapped-types';
import { ResponseTaskDto } from './response.dto';

export class CreateTaskDto extends PickType(ResponseTaskDto, [
  'title',
  'description',
  'expiredAt',
]) {}
