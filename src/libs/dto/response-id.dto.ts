import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';

export class ResponseIdDto {
  @IsUUID()
  @Expose()
  id: string;
}
