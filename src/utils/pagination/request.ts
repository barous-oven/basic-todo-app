import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationRequest {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number;
}
