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
