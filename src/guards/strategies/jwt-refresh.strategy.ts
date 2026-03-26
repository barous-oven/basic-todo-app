import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenType } from 'src/generated/prisma/enums';
import { TUserRefreshPayload } from 'src/modules/auth/auth.type';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY || 'your_jwt_secret_key',
      passReqToCallback: true,
    });
  }

  validate(
    req: Request,
    payload: { userId: string; type: TokenType },
  ): TUserRefreshPayload {
    const request = req.get('Authorization');
    const refreshToken = request?.replace('Bearer', '')?.trim();

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    return {
      userId: payload.userId,
      type: payload.type,
      refreshToken,
    };
  }
}
