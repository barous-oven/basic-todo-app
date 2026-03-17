import { OmitType } from '@nestjs/mapped-types';
import { RegisterRequestDto } from './register.dto';
import { IsString } from 'class-validator';

export class LoginRequestDto extends OmitType(RegisterRequestDto, ['name']) {}

export class LoginResponseDto {
  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;
}
