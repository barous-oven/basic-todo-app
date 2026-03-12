import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { EnvConfigModule } from 'src/config/envConfig.module';

@Module({
  imports: [EnvConfigModule],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
