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
import type { TUserPayload } from './auth.type';
import { JwtAuthGuard } from 'src/guards/auth.guard';

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
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: TUserPayload): Promise<UserResponseDto> {
    return this.authService.me(user);
  }

  @Get('/refresh')
  async refresh(
    @Headers('authorization') authHeader: string,
  ): Promise<LoginResponseDto> {
    const refreshToken = authHeader?.replace('Bearer ', '');
    return this.authService.refresh(refreshToken);
  }
}
