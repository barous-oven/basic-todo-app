import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/libs/database/prisma.service';
import { TaskStatus } from 'src/generated/prisma/enums';
import { TUserPayload } from '../auth/auth.type';
import { CreateTaskRequestDto } from './dto/create.dto';
import {
  GetListTaskRequestDto,
  GetListTaskResponseDto,
} from './dto/get-list.dto';
import { plainToInstance } from 'class-transformer';
import { Prisma } from 'src/generated/prisma/client';
import { UpdateTaskRequestDto } from './dto/update.dto';
import { GetDetailTaskResponseDto } from './dto/get-detail.dto';
import { PaginationResponseDto } from 'src/libs/dto/pagination.dto';
import { ResponseIdDto } from 'src/libs/dto/response-id.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: CreateTaskRequestDto,
    user: TUserPayload,
  ): Promise<ResponseIdDto> {
    const createdBy: string = user.userId;

    const task = await this.prisma.task.create({
      data: {
        ...data,
        status: TaskStatus.PENDING,
        createdBy,
      },
    });

    const response = plainToInstance(ResponseIdDto, task, {
      excludeExtraneousValues: true,
    });

    return response;
  }

  async getList(
    query: GetListTaskRequestDto,
    user: TUserPayload,
  ): Promise<PaginationResponseDto<GetListTaskResponseDto>> {
    const { limit, page, status, title, expiredAt } = query;

    const take = limit;
    const skip = (page - 1) * take;

    const where: Prisma.TaskWhereInput = {
      deletedAt: null,
      createdBy: user.userId,
    };

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
        currentPage: page,
      },
    };
  }

  async getDetail(
    id: string,
    user: TUserPayload,
  ): Promise<GetDetailTaskResponseDto> {
    const task = await this.prisma.task.findUnique({
      where: { id, deletedAt: null, createdBy: user.userId },
    });

    if (!task) {
      throw new NotFoundException('Task not found!');
    }

    const taskRes = plainToInstance(GetDetailTaskResponseDto, task, {
      excludeExtraneousValues: true,
    });

    return taskRes;
  }

  async update(
    id: string,
    data: UpdateTaskRequestDto,
    user: TUserPayload,
  ): Promise<ResponseIdDto> {
    const updatedData = await this.prisma.task.update({
      where: { id, deletedAt: null, createdBy: user.userId },
      data,
    });

    const response = plainToInstance(ResponseIdDto, updatedData, {
      excludeExtraneousValues: true,
    });

    return response;
  }

  async delete(id: string, user: TUserPayload): Promise<void> {
    await this.prisma.task.update({
      where: { id, createdBy: user.userId },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
