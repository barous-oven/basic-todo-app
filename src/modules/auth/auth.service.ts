import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/libs/database/prisma.service';
import { RegisterRequestDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import { LoginRequestDto, LoginResponseDto } from './dto/login.dto';
import { PasswordUtils } from 'src/utils/password/password.util';
import { TokenService } from '../token/token.service';
import { EnvConfigService } from '../../config/env-config.service';
import { TokenType } from 'src/generated/prisma/enums';
import { TUserPayload } from './auth.type';
import { UserResponseDto } from '../users/dto/user.dto';
import { plainToInstance } from 'class-transformer';

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
      throw new UnauthorizedException(`Invalid email or password`);
    }

    const isValid = await PasswordUtils.verifyPassword(
      data.password,
      user.password,
    );

    if (!isValid) {
      throw new UnauthorizedException(`Invalid email or password`);
    }

    const payload = {
      id: user.id,
    };

    const accessToken = await this.tokenService.generateToken(
      payload,
      this.envConfigService.jwt.access,
      TokenType.ACCESS,
    );
    const refreshToken = await this.tokenService.generateToken(
      payload,
      this.envConfigService.jwt.refresh,
      TokenType.REFRESH,
    );

    await this.tokenService.saveToken({
      userId: user.id,
      token: refreshToken,
      type: TokenType.REFRESH,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async me(user: TUserPayload): Promise<UserResponseDto> {
    const response = await this.prisma.user.findUnique({
      where: {
        id: user.userId,
      },
      omit: {
        password: true,
      },
    });

    if (!response) throw new NotFoundException('User not found!');

    return plainToInstance(UserResponseDto, response, {
      excludeExtraneousValues: true,
    });
  }

  async refresh(token: string): Promise<LoginResponseDto> {
    const currentRefreshToken = await this.prisma.token.findUnique({
      where: {
        token: token,
        type: TokenType.REFRESH,
      },
    });

    if (!currentRefreshToken) throw new UnauthorizedException();

    const isValid = this.tokenService.validateToken(
      token,
      this.envConfigService.jwt.refresh,
    );

    if (!isValid) throw new UnauthorizedException();

    const accessToken = await this.tokenService.generateToken(
      { id: currentRefreshToken.userId },
      this.envConfigService.jwt.access,
      TokenType.ACCESS,
    );
    const refreshToken = await this.tokenService.generateToken(
      { id: currentRefreshToken.userId },
      this.envConfigService.jwt.refresh,
      TokenType.REFRESH,
    );

    await this.tokenService.saveToken({
      userId: currentRefreshToken.userId,
      token: refreshToken,
      type: TokenType.REFRESH,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
