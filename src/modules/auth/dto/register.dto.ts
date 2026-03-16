import {
  CreateUserRequestDto,
  UserResponseDto,
} from 'src/modules/users/dto/user.dto';

export class RegisterRequestDto extends CreateUserRequestDto {}

export class RegisterResponseDto extends UserResponseDto {}
