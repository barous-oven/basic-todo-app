import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { ResponseIdDto } from '../../libs/dto/response-id.dto';
import { CreateTagRequestDto } from './dto/create-tag.dto';
import { UpdateTagRequestDto } from './dto/update-tag.dto';
import { GetListTagRequestDto, GetTagResponseDto } from './dto/get-tag.dto';
import { PaginationResponseDto } from 'src/libs/dto/pagination.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  async create(@Body() data: CreateTagRequestDto): Promise<ResponseIdDto> {
    return this.tagsService.create(data);
  }

  @Get()
  async findAll(
    @Query() query: GetListTagRequestDto,
  ): Promise<PaginationResponseDto<GetTagResponseDto>> {
    return this.tagsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<GetTagResponseDto> {
    return this.tagsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateTagRequestDto,
  ): Promise<ResponseIdDto> {
    return this.tagsService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.tagsService.remove(id);
  }
}
