import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/libs/database/prisma.service';
import { TaskStatus } from 'src/generated/prisma/enums';
import { TUserPayload } from '../auth/auth.type';
import { CreateTaskRequestDto, CreateTaskResponseDto } from './dto/create.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: CreateTaskRequestDto,
    user: TUserPayload,
  ): Promise<CreateTaskResponseDto> {
    const { title, description, expiredAt } = data;

    const createdBy: string = user.userId;

    return await this.prisma.task.create({
      data: {
        title,
        description,
        status: TaskStatus.PENDING,
        createdBy,
        expiredAt,
      },
    });
  }
}
