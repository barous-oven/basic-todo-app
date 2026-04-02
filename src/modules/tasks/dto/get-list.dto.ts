import { GetDetailTaskResponseDto } from './get-detail.dto';
import { PickType } from '@nestjs/mapped-types';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { PaginationRequestDto } from 'src/libs/dto/pagination.dto';
import { TaskStatus } from 'src/generated/prisma/enums';
import { GetTagResponseDto } from 'src/modules/tags/dto/get-tag.dto';
import { Expose, Type } from 'class-transformer';

export class GetListTaskRequestDto extends PaginationRequestDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsString()
  @IsUUID()
  @IsOptional()
  tagId?: string;

  @IsOptional()
  @IsDateString()
  expiredAt?: string;
}

export class GetListTaskResponseDto extends PickType(GetDetailTaskResponseDto, [
  'id',
  'title',
  'status',
  'expiredAt',
  'tagIds',
]) {
  @Expose()
  @Type(() => TagDto)
  tags: TagDto[];
}

class TagDto extends PickType(GetTagResponseDto, ['id', 'title']) {}
