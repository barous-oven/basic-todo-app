import { GetDetailTaskResponseDto } from './get-detail.dto';
import { PickType } from '@nestjs/mapped-types';

export class CreateTaskRequestDto extends PickType(GetDetailTaskResponseDto, [
  'title',
  'description',
  'expiredAt',
  'tagIds',
]) {}

export class CreateManyTaskRequestDto extends PickType(
  GetDetailTaskResponseDto,
  ['title', 'description', 'expiredAt'],
) {}
