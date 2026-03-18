import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/libs/database/prisma.service';
import { CreateTaskDto } from './dto/create.dto';
import { TaskStatus } from 'src/generated/prisma/enums';
import { ResponseTaskDto } from './dto/response.dto';
import { TUserPayload } from '../auth/auth.type';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: CreateTaskDto,
    user: TUserPayload,
  ): Promise<ResponseTaskDto> {
    const { title, description } = data;

    const createdBy: string = user.userId;

    const createdTask = await this.prisma.task.create({
      data: {
        title,
        description: description || '',
        status: TaskStatus.PENDING,
        createdBy,
      },
    });

    return ResponseTaskDto.toResponse(createdTask);
  }
}
