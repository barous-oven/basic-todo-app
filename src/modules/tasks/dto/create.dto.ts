import { PickType } from '@nestjs/mapped-types';
import { DetailTaskDto } from './detail.dto';

export class CreateTaskRequestDto extends PickType(DetailTaskDto, [
  'title',
  'description',
  'expiredAt',
]) {}

export class CreateTaskResponseDto extends PickType(DetailTaskDto, ['id']) {}
