import { PrismaService } from 'src/libs/database/prisma.service';
import { CreateTokenRequestDto } from './dto/token.dto';
import * as jwt from 'jsonwebtoken';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EnvConfigService } from 'src/config/envConfig.service';

@Injectable()
export class TokenService {
  constructor(private readonly prisma: PrismaService) {}

  async saveRefreshToken(data: CreateTokenRequestDto): Promise<void> {
    const { userId, token } = data;

    await this.prisma.refreshToken.upsert({
      where: { userId },
      update: { token: token },
      create: {
        userId,
        token: token,
      },
    });
  }
}
