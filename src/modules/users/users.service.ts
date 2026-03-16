import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/libs/database/prisma.service';
import { PasswordUtils } from 'src/utils/password/password.util';
import { CreateUserRequestDto, UserResponseDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    CreateUserRequestDto: CreateUserRequestDto,
  ): Promise<UserResponseDto> {
    const hashedPassword = await PasswordUtils.hashPassword(
      CreateUserRequestDto.password,
    );

    return this.prisma.user.create({
      data: {
        email: CreateUserRequestDto.email,
        password: hashedPassword,
        name: CreateUserRequestDto.name,
      },
      omit: {
        password: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      omit: {
        password: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }
}
