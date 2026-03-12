import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/libs/database/prisma.service';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    console.log('🚀 ~ UsersService ~ create ~ createUserDto:', createUserDto);
    return 'This action adds a new user';
  }

  async findAll(): Promise<GetUserDto[]> {
    const users = await this.prisma.user.findMany();

    return users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name || '',
    }));
  }

  async findOne(id: string): Promise<GetUserDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return {
      id,
      email: user.email,
      name: user.name || '',
    };
  }

  async findByEmail(email: string): Promise<GetUserDto> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name || '',
    };
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    console.log('🚀 ~ UsersService ~ update ~ updateUserDto:', updateUserDto);
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
