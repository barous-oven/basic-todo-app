import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { TUserPayload } from 'src/modules/auth/auth.type';
import { TokenType } from 'src/generated/prisma/enums';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY || 'your_jwt_secret_key',
    });
  }

  validate(payload: { userId: string; type: TokenType }): TUserPayload {
    return {
      userId: payload.userId,
      type: payload.type,
    };
  }
}
