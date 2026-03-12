import { IsString, IsUUID } from 'class-validator';

export class CreateTokenRequestDto {
  @IsUUID()
  userId: string;

  @IsString()
  token: string;
}
