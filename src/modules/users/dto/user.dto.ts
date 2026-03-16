import { UserModel } from 'src/generated/prisma/models';
import { IsEmail, IsString, MinLength } from 'class-validator';

export type UserResponseDto = Omit<
  UserModel,
  'password' | 'createdAt' | 'updatedAt'
>;

export class CreateUserRequestDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  name: string;
}
