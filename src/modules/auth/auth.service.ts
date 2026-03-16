import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/libs/database/prisma.service';
import { RegisterRequestDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async register(data: RegisterRequestDto): Promise<string> {
    try {
      const user = await this.usersService.create(data);
      return `User with email ${user.id} registered successfully`;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }
}
