import { PickType } from '@nestjs/mapped-types';
import { GetDetailTaskResponseDto } from './get-detail.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetAIGeneratedTaskResponseDto extends PickType(
  GetDetailTaskResponseDto,
  ['title', 'description', 'expiredAt'],
) {}

export class GetAIGeneratedTaskRequestDto {
  @IsString()
  @IsNotEmpty()
  requirement: string;
}
