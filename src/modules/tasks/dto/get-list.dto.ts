import { GetDetailTaskResponseDto } from './get-detail.dto';
import { PickType } from '@nestjs/mapped-types';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequestDto } from 'src/libs/dto/pagination.dto';
import { TaskStatus } from 'src/generated/prisma/enums';

export class GetListTaskRequestDto extends PaginationRequestDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsDateString()
  expiredAt?: string;
}

export class GetListTaskResponseDto extends PickType(GetDetailTaskResponseDto, [
  'id',
  'title',
  'status',
  'expiredAt',
]) {}
