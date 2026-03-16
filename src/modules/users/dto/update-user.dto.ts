import { PartialType } from '@nestjs/mapped-types';
import { CreateUserRequestDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserRequestDto) {}
