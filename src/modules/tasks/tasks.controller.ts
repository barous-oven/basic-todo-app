import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskRequestDto, CreateTaskResponseDto } from './dto/create.dto';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/libs/decorator/current-user.decorator';
import type { TUserPayload } from '../auth/auth.type';
import { PaginationResponse } from '../../utils/pagination/response';
import {
  GetListRequestTaskDto,
  GetListTaskResponseDto,
} from './dto/get-list.dto';

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
  ): Promise<CreateTaskResponseDto> {
    return await this.tasksService.create(data, user);
  }

  @Get()
  async getList(
    @Query() options: GetListRequestTaskDto,
  ): Promise<PaginationResponse<GetListTaskResponseDto[]>> {
    return this.tasksService.getList(options);
  }
}
