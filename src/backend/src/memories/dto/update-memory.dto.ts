import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class UpdateMemoryDto {
  @IsString()
  @MaxLength(100)
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsUUID()
  @IsOptional()
  emotionID?: string;
}