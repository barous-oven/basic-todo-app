import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTagRequestDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;
}
