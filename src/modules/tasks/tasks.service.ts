import { GoogleGenAI } from '@google/genai';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { getPromt } from 'src/constants/ai-task-promt';
import { Prisma } from 'src/generated/prisma/client';
import { TaskStatus } from 'src/generated/prisma/enums';
import { PrismaService } from 'src/libs/database/prisma.service';
import { PaginationResponseDto } from 'src/libs/dto/pagination.dto';
import { ResponseIdDto } from 'src/libs/dto/response-id.dto';
import { TUserPayload } from '../auth/auth.type';
import {
  CreateManyTaskRequestDto,
  CreateTaskRequestDto,
} from './dto/create.dto';
import { GetAIGeneratedTaskResponseDto } from './dto/get-ai-generated-task.dto';
import { GetDetailTaskResponseDto } from './dto/get-detail.dto';
import {
  GetListTaskRequestDto,
  GetListTaskResponseDto,
} from './dto/get-list.dto';
import { UpdateTaskRequestDto } from './dto/update.dto';
import { TaskTagModel } from 'src/generated/prisma/models';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: CreateTaskRequestDto,
    user: TUserPayload,
  ): Promise<ResponseIdDto> {
    const creatorId: string = user.userId;

    const { tagIds, ...rest } = data;

    const task = await this.prisma.task.create({
      data: {
        ...rest,
        status: TaskStatus.PENDING,
        creatorId,
      },
    });

    await this.createTaskTag(task.id, tagIds);

    const response = plainToInstance(ResponseIdDto, task, {
      excludeExtraneousValues: true,
    });

    return response;
  }

  async createMany(
    data: CreateManyTaskRequestDto[],
    user: TUserPayload,
  ): Promise<void> {
    const creatorId = user.userId;

    const tasks = data.map((task) => ({
      ...task,
      creatorId,
      status: TaskStatus.PENDING,
    }));

    await this.prisma.task.createMany({ data: tasks });
  }

  async getList(
    query: GetListTaskRequestDto,
    user: TUserPayload,
  ): Promise<PaginationResponseDto<GetListTaskResponseDto>> {
    const { limit, page, status, title, expiredAt, tag } = query;

    const take = limit;
    const skip = (page - 1) * take;

    const where: Prisma.TaskWhereInput = {
      deletedAt: null,
      creatorId: user.userId,
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

    if (tag) {
      const taskIds = await this.getTaskForTag(tag);

      where.id = {
        in: taskIds,
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
        include: {
          taskTags: {
            include: {
              tag: true,
            },
          },
        },
      }),
      this.prisma.task.count({ where }),
    ]);

    const totalPages = Math.ceil(total / take);

    const taskResponse = tasks.map((task) => {
      const { taskTags, ...base } = task;

      return {
        ...base,
        tags: taskTags.map((taskTag) => taskTag.tag),
      };
    });

    const taskResult = plainToInstance(GetListTaskResponseDto, taskResponse, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
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
      where: { id, deletedAt: null, creatorId: user.userId },
    });

    if (!task) {
      throw new NotFoundException('Task not found!');
    }

    const tagIds = await this.getTagForTask(id);

    const taskRes = plainToInstance(GetDetailTaskResponseDto, task, {
      excludeExtraneousValues: true,
    });

    return {
      ...taskRes,
      tagIds,
    };
  }

  async update(
    id: string,
    data: UpdateTaskRequestDto,
    user: TUserPayload,
  ): Promise<ResponseIdDto> {
    const { tagIds, ...rest } = data;

    const updatedData = await this.prisma.task.update({
      where: { id, deletedAt: null, creatorId: user.userId },
      data: rest,
    });

    if (tagIds) await this.updateTagForTask(updatedData.id, tagIds);

    const response = plainToInstance(ResponseIdDto, updatedData, {
      excludeExtraneousValues: true,
    });

    return response;
  }

  async delete(id: string, user: TUserPayload): Promise<void> {
    await this.prisma.task.update({
      where: { id, creatorId: user.userId },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async getTaskWithAI(
    requirement: string,
  ): Promise<GetAIGeneratedTaskResponseDto[]> {
    const ai = new GoogleGenAI({});
    const contents = getPromt(requirement);
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents,
    });
    const responseText = response.text;
    if (!responseText) {
      throw new InternalServerErrorException();
    }
    try {
      const cleanedJson = responseText.replace(/^```json|```$/g, '');
      const tasks: GetAIGeneratedTaskResponseDto[] = JSON.parse(cleanedJson);
      return tasks;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  private async createTaskTag(taskId: string, tagIds: string[]) {
    if (tagIds.length > 0) {
      const data = tagIds.map((tagId: string): Omit<TaskTagModel, 'id'> => {
        return {
          taskId,
          tagId,
        };
      });

      await this.prisma.taskTag.createMany({ data });
    }
  }

  private async getTagForTask(taskId: string): Promise<string[]> {
    const taskTags = await this.prisma.taskTag.findMany({
      where: {
        taskId,
      },
    });

    const tagIds = taskTags.map((taskTag) => taskTag.tagId);
    return tagIds;
  }

  private async getTaskForTag(tagId: string): Promise<string[]> {
    const taskTags = await this.prisma.taskTag.findMany({
      where: {
        tagId,
      },
    });

    const taskIds = taskTags.map((taskTag) => taskTag.taskId);
    return taskIds;
  }

  private async updateTagForTask(taskId: string, tagIds: string[]) {
    await this.prisma.taskTag.deleteMany({
      where: {
        taskId,
      },
    });

    await this.createTaskTag(taskId, tagIds);
  }
}
