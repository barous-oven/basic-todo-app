import { PartialType } from '@nestjs/mapped-types';
import { CreateTagRequestDto } from './create-tag.dto';

export class UpdateTagRequestDto extends PartialType(CreateTagRequestDto) {}
