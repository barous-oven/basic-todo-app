import { PickType } from '@nestjs/mapped-types';
import { ResponseTaskDto } from './detail.dto';

export class CreateTaskRequestDto extends PickType(ResponseTaskDto, [
  'title',
  'description',
  'expiredAt',
]) {}

export class CreateTaskResponseDto extends PickType(ResponseTaskDto, ['id']) {}
