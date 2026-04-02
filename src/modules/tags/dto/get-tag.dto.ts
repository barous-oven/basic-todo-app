import { Expose, Transform } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { PaginationRequestDto } from 'src/libs/dto/pagination.dto';

export class GetTagResponseDto {
  @IsUUID()
  @IsString()
  @Expose()
  id: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  title: string;

  @IsString()
  @IsOptional()
  @Expose()
  description: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @Expose()
  createdAt: Date;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @Expose()
  updatedAt: Date;
}

export class GetListTagRequestDto extends PaginationRequestDto {
  @IsOptional()
  @IsString()
  title?: string;
}
