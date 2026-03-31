import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/libs/database/prisma.service';
import { PaginationResponseDto } from 'src/libs/dto/pagination.dto';
import { ResponseIdDto } from '../../libs/dto/response-id.dto';
import { CreateTagRequestDto } from './dto/create-tag.dto';
import { GetListTagRequestDto, GetTagResponseDto } from './dto/get-tag.dto';
import { UpdateTagRequestDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateTagRequestDto): Promise<ResponseIdDto> {
    const tag = await this.prisma.tag.create({ data });

    return { id: tag.id };
  }

  async findAll(
    query: GetListTagRequestDto,
  ): Promise<PaginationResponseDto<GetTagResponseDto>> {
    const { limit, page, title } = query;

    const take = limit;
    const skip = (page - 1) * take;

    const where: Prisma.TagWhereInput = {
      deletedAt: null,
    };

    if (title) {
      where.title = {
        contains: title,
        mode: 'insensitive',
      };
    }

    const [tags, total] = await Promise.all([
      this.prisma.tag.findMany({
        where,
        skip,
        take,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.tag.count({ where }),
    ]);

    const totalPages = Math.ceil(total / take);

    const taskResult = plainToInstance(GetTagResponseDto, tags, {
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

  async findOne(id: string): Promise<GetTagResponseDto> {
    const tag = await this.prisma.tag.findUnique({
      where: { id, deletedAt: null },
    });

    if (!tag) {
      throw new NotFoundException('Task not found!');
    }

    return plainToInstance(GetTagResponseDto, tag, {
      excludeExtraneousValues: true,
    });
  }

  async findManyByIds(ids: string[]): Promise<GetTagResponseDto[]> {
    const tags = await this.prisma.tag.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    if (!tags) {
      throw new NotFoundException('Task not found!');
    }

    return plainToInstance(GetTagResponseDto, tags, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, data: UpdateTagRequestDto): Promise<ResponseIdDto> {
    const updatedTag = await this.prisma.tag.update({
      where: { id, deletedAt: null },
      data,
    });

    return plainToInstance(ResponseIdDto, updatedTag, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.tag.update({
      where: { id, deletedAt: null },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
