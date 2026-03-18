import { IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationMeta {
  @IsNumber()
  total: number;

  @IsNumber()
  totalPages: number;
}

export class PaginationResponse<T> {
  @ValidateNested()
  @Type(() => PaginationMeta)
  meta: PaginationMeta;

  data: T[];
}
