import { IsEmail, IsString, IsUUID, MinLength } from 'class-validator';
import { OmitType } from '@nestjs/mapped-types';

export class UserResponseDto {
  @IsUUID()
  id: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  name: string;
}

export class CreateUserRequestDto extends OmitType(UserResponseDto, ['id']) {
  @IsString()
  @MinLength(8)
  password: string;
}
