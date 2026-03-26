import { Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';

export class PaginationRequestDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit: number = 10;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;
}

export class PaginationMetaDto {
  @IsNumber()
  total: number;

  @IsNumber()
  totalPages: number;

  @IsNumber()
  currentPage: number;
}

export class PaginationResponseDto<T> {
  @ValidateNested()
  @Type(() => PaginationMetaDto)
  meta: PaginationMetaDto;

  data: T[];
}
