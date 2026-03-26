import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/libs/decorator/current-user.decorator';
import { PaginationResponseDto } from 'src/libs/dto/pagination.dto';
import { ResponseIdDto } from 'src/libs/dto/response-id.dto';
import type { TUserPayload } from '../auth/auth.type';
import { CreateTaskRequestDto } from './dto/create.dto';
import { GetDetailTaskResponseDto } from './dto/get-detail.dto';
import {
  GetListTaskRequestDto,
  GetListTaskResponseDto,
} from './dto/get-list.dto';
import { UpdateTaskRequestDto } from './dto/update.dto';
import { TasksService } from './tasks.service';

@Controller({
  version: '1',
  path: 'tasks',
})
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(
    @Body() data: CreateTaskRequestDto,
    @CurrentUser() user: TUserPayload,
  ): Promise<ResponseIdDto> {
    return await this.tasksService.create(data, user);
  }

  @Get()
  async getList(
    @Query() query: GetListTaskRequestDto,
    @CurrentUser() user: TUserPayload,
  ): Promise<PaginationResponseDto<GetListTaskResponseDto>> {
    return this.tasksService.getList(query, user);
  }

  @Get(':id')
  async getDetail(
    @Param('id') id: string,
    @CurrentUser() user: TUserPayload,
  ): Promise<GetDetailTaskResponseDto> {
    return this.tasksService.getDetail(id, user);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateTaskRequestDto,
    @CurrentUser() user: TUserPayload,
  ): Promise<ResponseIdDto> {
    return this.tasksService.update(id, data, user);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: TUserPayload,
  ): Promise<void> {
    await this.tasksService.delete(id, user);
  }
}
