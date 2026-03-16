import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequestDto } from './dto/register.dto';
import { BaseResponse } from 'src/utils/response/response.util';
import { HttpStatus } from '@nestjs/common';

@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() data: RegisterRequestDto) {
    const response = await this.authService.register(data);

    return BaseResponse.success<string>(HttpStatus.CREATED, response);
  }
}
