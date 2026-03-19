import { GetDetailTaskResponseDto } from './get-detail.dto';
import { OmitType } from '@nestjs/mapped-types';

export class UpdateTaskRequestDto extends OmitType(GetDetailTaskResponseDto, [
  'id',
  'createdBy',
  'createdAt',
  'updatedAt',
]) {}
