import { Expose, Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { TaskStatus } from 'src/generated/prisma/enums';

export class GetDetailTaskResponseDto {
  @IsUUID()
  @Expose()
  id: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  title: string;

  @IsString()
  @IsOptional()
  @Expose()
  description?: string | null;

  @IsEnum(TaskStatus)
  @Expose()
  status: TaskStatus;

  @IsUUID()
  @Expose()
  creatorId: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @Expose()
  expiredAt: Date;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @Expose()
  createdAt: Date;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @Expose()
  updatedAt: Date;
}
