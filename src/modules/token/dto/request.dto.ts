import { IsEnum, IsString, IsUUID } from 'class-validator';
import { TokenType } from 'src/generated/prisma/enums';

export class CreateTokenRequestDto {
  @IsUUID()
  userId: string;

  @IsString()
  token: string;

  @IsEnum(TokenType)
  type: TokenType;
}
