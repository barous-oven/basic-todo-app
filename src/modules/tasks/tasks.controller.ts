import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create.dto';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { ResponseTaskDto } from './dto/response.dto';
import { CurrentUser } from 'src/libs/decorator/current-user.decorator';
import type { TUserPayload } from '../auth/auth.type';

@Controller({
  version: '1',
  path: 'tasks',
})
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(
    @Body() data: CreateTaskDto,
    @CurrentUser() user: TUserPayload,
  ): Promise<ResponseTaskDto> {
    return await this.tasksService.create(data, user);
  }
}
