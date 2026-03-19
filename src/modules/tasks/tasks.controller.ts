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
import { TasksService } from './tasks.service';
import { CreateTaskRequestDto } from './dto/create.dto';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/libs/decorator/current-user.decorator';
import type { TUserPayload } from '../auth/auth.type';
import {
  GetListTaskRequestDto,
  GetListTaskResponseDto,
} from './dto/get-list.dto';
import { UpdateTaskRequestDto } from './dto/update.dto';
import { OwnerShipGuard } from 'src/guards/ownership.guard';
import { GetDetailTaskResponseDto } from './dto/get-detail.dto';
import { PaginationResponseDto } from 'src/libs/dto/pagination.dto';
import { ResponseIdDto } from 'src/libs/dto/response-id.dto';

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
  ): Promise<PaginationResponseDto<GetListTaskResponseDto>> {
    return this.tasksService.getList(query);
  }

  @Get(':id')
  @UseGuards(OwnerShipGuard('task'))
  async getDetail(@Param('id') id: string): Promise<GetDetailTaskResponseDto> {
    return this.tasksService.getDetail(id);
  }

  @Put(':id')
  @UseGuards(OwnerShipGuard('task'))
  async update(
    @Param('id') id: string,
    @Body() data: UpdateTaskRequestDto,
  ): Promise<ResponseIdDto> {
    return this.tasksService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(OwnerShipGuard('task'))
  async delete(@Param('id') id: string): Promise<void> {
    await this.tasksService.delete(id);
  }
}
