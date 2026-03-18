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
    const createdBy: string = user.userId;

    const task = await this.prisma.task.create({
      data: {
        ...data,
        status: TaskStatus.PENDING,
        createdBy,
      },
    });

    return {
      id: task.id,
    };
  }
}
