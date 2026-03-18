import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskRequestDto, CreateTaskResponseDto } from './dto/create.dto';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/libs/decorator/current-user.decorator';
import type { TUserPayload } from '../auth/auth.type';
import { PaginationResponse } from '../../utils/pagination/response';
import {
  GetListTaskRequestDto,
  GetListTaskResponseDto,
} from './dto/get-list.dto';
import { UpdateTaskRequestDto, UpdateTaskResponseDto } from './dto/update.dto';
import { OwnerShipGuard } from 'src/guards/ownership.guard';

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
    @Query() query: GetListTaskRequestDto,
  ): Promise<PaginationResponse<GetListTaskResponseDto>> {
    return this.tasksService.getList(query);
  }

  @Put(':id')
  @UseGuards(OwnerShipGuard('task'))
  async update(
    @Param('id') id: string,
    @Body() data: UpdateTaskRequestDto,
  ): Promise<UpdateTaskResponseDto> {
    return this.tasksService.update(id, data);
  }
}
