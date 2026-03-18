import { TokenType } from 'src/generated/prisma/enums';

export type TUserPayload = {
  userId: string;
  type: TokenType;
};
