import { IsEmail, IsString, IsUUID, MinLength } from 'class-validator';
import { OmitType } from '@nestjs/mapped-types';
import { Expose } from 'class-transformer';

export class UserResponseDto {
  @IsUUID()
  @Expose()
  id: string;

  @IsString()
  @IsEmail()
  @Expose()
  email: string;

  @IsString()
  @Expose()
  name: string;
}

export class CreateUserRequestDto extends OmitType(UserResponseDto, ['id']) {
  @IsString()
  @MinLength(8)
  password: string;
}
