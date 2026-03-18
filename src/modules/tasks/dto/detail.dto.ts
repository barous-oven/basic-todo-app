import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { TaskStatus } from 'src/generated/prisma/enums';

export class DetailTaskDto {
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsUUID()
  createdBy: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  expiredAt: Date;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  createdAt: Date;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  updatedAt: Date;
}
