import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { TaskStatus } from 'src/generated/prisma/enums';
import { TaskModel } from 'src/generated/prisma/models';

export class ResponseTaskDto {
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

  @IsDateString()
  expiredAt: string;

  @IsDateString()
  createdAt: string;

  @IsDateString()
  updatedAt: string;

  static toResponse(task: TaskModel): ResponseTaskDto {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      createdBy: task.createdBy,
      expiredAt: task.expiredAt.toISOString(),
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    };
  }
}
