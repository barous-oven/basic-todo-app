import { OmitType, PickType } from '@nestjs/mapped-types';
import { DetailTaskDto } from './detail.dto';

export class UpdateTaskRequestDto extends OmitType(DetailTaskDto, [
  'id',
  'createdBy',
  'createdAt',
  'updatedAt',
]) {}

export class UpdateTaskResponseDto extends PickType(DetailTaskDto, ['id']) {}
