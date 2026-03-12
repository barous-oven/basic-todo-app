import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/libs/database/prisma.service';
import { RegisterRequestDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import { LoginRequestDto, LoginResponseDto } from './dto/login.dto';
import { PasswordUtils } from 'src/utils/password/password.util';
import { TokenService } from '../token/token.service';
import * as jwt from 'jsonwebtoken';
import { EnvConfigService } from '../../config/envConfig.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly envConfigService: EnvConfigService,
  ) {}

  async register(data: RegisterRequestDto): Promise<void> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException(
        `User with email ${data.email} already exists`,
      );
    }

    await this.usersService.create(data);
  }

  async login(data: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new ConflictException(`Invalid email or password`);
    }

    const isValid = await PasswordUtils.verifyPassword(
      data.password,
      user.password,
    );

    if (!isValid) {
      throw new ConflictException(`Invalid email or password`);
    }

    const payload = {
      id: user.id,
    };

    const accessToken = this.generateToken(
      payload,
      this.envConfigService.jwt.access,
    );
    const refreshToken = this.generateToken(
      payload,
      this.envConfigService.jwt.refresh,
      true,
    );

    this.tokenService.saveRefreshToken({
      userId: user.id,
      token: refreshToken,
    });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  private generateToken(
    payload: { id: string },
    jwtConfig: { secret: string; expiresIn: string },
    isRefresh: boolean = false,
  ) {
    return jwt.sign(
      { userId: payload.id, type: isRefresh ? 'refresh' : 'access' },
      jwtConfig.secret,
      {
        expiresIn: jwtConfig.expiresIn,
      } as jwt.SignOptions,
    );
  }
}
