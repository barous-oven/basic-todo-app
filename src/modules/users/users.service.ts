import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateUserRequestDto,
  CreateUserResponseDto,
} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/libs/database/prisma.service';
import { GetUserResponseDto } from './dto/get-user.dto';
import { PasswordUtils } from 'src/utils/password/password.util';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    CreateUserRequestDto: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    const hashedPassword = await PasswordUtils.hashPassword(
      CreateUserRequestDto.password,
    );

    return this.prisma.user.create({
      data: {
        email: CreateUserRequestDto.email,
        password: hashedPassword,
        name: CreateUserRequestDto.name,
      },
    });
  }

  async findAll(): Promise<GetUserResponseDto[]> {
    const users = await this.prisma.user.findMany();

    return users.map(
      (user) =>
        new GetUserResponseDto({
          id: user.id,
          email: user.email,
          name: user.name || '',
        }),
    );
  }

  async findOne(id: string): Promise<GetUserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return new GetUserResponseDto({
      id: user.id,
      email: user.email,
      name: user.name || '',
    });
  }

  async findByEmail(email: string): Promise<GetUserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return new GetUserResponseDto({
      id: user.id,
      email: user.email,
      name: user.name || '',
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    console.log('🚀 ~ UsersService ~ update ~ updateUserDto:', updateUserDto);
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
