import { Global, Module } from '@nestjs/common';
import { EnvConfigService } from './envConfig.service';

@Global()
@Module({
  providers: [EnvConfigService],
  exports: [EnvConfigService],
})
export class EnvConfigModule {}
