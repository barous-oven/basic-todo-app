import { ConflictException, Injectable } from '@nestjs/common';
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
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException(
        `User with email ${data.email} already exists`,
      );
    }

    const user = await this.usersService.create(data);
    return `User with id ${user.id} registered successfully`;
  }
}
