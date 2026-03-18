import { PickType } from '@nestjs/mapped-types';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from 'src/generated/prisma/enums';
import { PaginationRequest } from 'src/utils/pagination/request';
import { DetailTaskDto } from './detail.dto';

export class GetListRequestTaskDto extends PaginationRequest {
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

export class GetListTaskResponseDto extends PickType(DetailTaskDto, [
  'id',
  'title',
  'status',
  'expiredAt',
]) {}
