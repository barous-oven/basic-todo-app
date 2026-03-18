import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/libs/database/prisma.service';
import { TaskStatus } from 'src/generated/prisma/enums';
import { TUserPayload } from '../auth/auth.type';
import { CreateTaskRequestDto, CreateTaskResponseDto } from './dto/create.dto';
import {
  GetListRequestTaskDto,
  GetListTaskResponseDto,
} from './dto/get-list.dto';
import { PaginationResponse } from 'src/utils/pagination/response';
import { plainToInstance } from 'class-transformer';

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

  async getList(
    options: GetListRequestTaskDto,
  ): Promise<PaginationResponse<GetListTaskResponseDto[]>> {
    const { limit, page, status, title, expiredAt } = options;

    const take = limit || 10;
    const skip = ((page || 1) - 1) * take;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (title) {
      where.title = {
        contains: title,
        mode: 'insensitive',
      };
    }

    if (expiredAt) {
      where.expiredAt = {
        lte: expiredAt,
      };
    }

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        skip,
        take,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.task.count({ where }),
    ]);

    const totalPages = Math.ceil(total / take);

    const taskResult = plainToInstance(GetListTaskResponseDto, tasks, {
      excludeExtraneousValues: true,
    });

    return {
      data: taskResult,
      meta: {
        total,
        totalPages,
      },
    };
  }
}
