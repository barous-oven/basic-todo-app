import { PrismaService } from 'src/libs/database/prisma.service';
import { CreateTokenRequestDto } from './dto/request.dto';
import { Injectable } from '@nestjs/common';
import { TokenType } from 'src/generated/prisma/enums';
import { StringValue } from 'ms';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokenService {
  constructor(private readonly prisma: PrismaService) {}

  async saveToken(data: CreateTokenRequestDto): Promise<void> {
    await this.prisma.token.create({
      data: data,
    });
  }

  public generateToken(
    payload: { id: string },
    jwtConfig: { secret: string; expiresIn: StringValue },
    type: TokenType = TokenType.ACCESS,
  ) {
    return jwt.sign({ userId: payload.id, type }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    });
  }
}
