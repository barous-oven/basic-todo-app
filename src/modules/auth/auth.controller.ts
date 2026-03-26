import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequestDto } from './dto/register.dto';
import { LoginRequestDto, LoginResponseDto } from './dto/login.dto';
import { UserResponseDto } from '../users/dto/user.dto';
import { CurrentUser } from 'src/libs/decorator/current-user.decorator';
import type { TUserPayload, TUserRefreshPayload } from './auth.type';
import { JwtAccessAuthGuard } from 'src/guards/auth-access.guard';
import { JwtRefreshAuthGuard } from 'src/guards/auth-refresh.guard';

@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() data: RegisterRequestDto): Promise<void> {
    return this.authService.register(data);
  }

  @Post('/login')
  async login(@Body() data: LoginRequestDto): Promise<LoginResponseDto> {
    return this.authService.login(data);
  }

  @Get('/me')
  @UseGuards(JwtAccessAuthGuard)
  async me(@CurrentUser() user: TUserPayload): Promise<UserResponseDto> {
    return this.authService.me(user);
  }

  @Get('/refresh')
  @UseGuards(JwtRefreshAuthGuard)
  async refresh(
    @CurrentUser() user: TUserRefreshPayload,
  ): Promise<LoginResponseDto> {
    return this.authService.refresh(user.refreshToken);
  }
}
