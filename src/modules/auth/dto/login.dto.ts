import { OmitType } from '@nestjs/mapped-types';
import { RegisterRequestDto } from './register.dto';

export class LoginRequestDto extends OmitType(RegisterRequestDto, ['name']) {}

export class LoginResponseDto {
  accessToken: string;
  refreshToken: string;
}
