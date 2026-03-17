import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StringValue } from 'ms';

@Injectable()
export class EnvConfigService {
  constructor(private readonly configService: ConfigService) {}

  get databaseUrl(): string {
    return this.configService.get<string>(
      'DATABASE_URL',
      'postgresql://postgres:change_me@localhost:5432/mydatabase',
    );
  }

  get jwt(): {
    access: { secret: string; expiresIn: StringValue };
    refresh: { secret: string; expiresIn: StringValue };
  } {
    return {
      access: {
        secret: this.configService.get<string>(
          'JWT_SECRET_KEY',
          'your_jwt_secret_key',
        ),
        expiresIn: this.configService.get<StringValue>(
          'ACCESS_EXPIRES_IN',
          '1h',
        ),
      },
      refresh: {
        secret: this.configService.get<string>(
          'JWT_SECRET_KEY',
          'your_jwt_secret_key',
        ),
        expiresIn: this.configService.get<StringValue>(
          'REFRESH_EXPIRES_IN',
          '7d',
        ),
      },
    };
  }
}
