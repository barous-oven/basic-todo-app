import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { BaseResponse } from 'src/utils/response/response.util';
import { GetUserResponseDto } from './dto/get-user.dto';
import { HttpStatus } from '@nestjs/common';

@Controller({
  version: '1',
  path: 'users',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();

    return BaseResponse.success<GetUserResponseDto[]>(
      HttpStatus.OK,
      'Users retrieved successfully',
      users,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);

    if (!user) {
      return `User with id ${id} not found`;
    }

    return BaseResponse.success<GetUserResponseDto>(
      HttpStatus.OK,
      'User found',
      user,
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
