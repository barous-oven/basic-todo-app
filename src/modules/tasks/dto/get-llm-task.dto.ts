import { Expose, Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetLLMTaskResponseDto {
  @IsString()
  @IsNotEmpty()
  @Expose()
  title: string;

  @IsString()
  @IsOptional()
  @Expose()
  description?: string | null;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @Expose()
  expiredAt: Date;
}
