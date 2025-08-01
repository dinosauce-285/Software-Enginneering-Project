import { IsOptional, IsString, IsUUID, MaxLength, IsArray, IsDateString, IsNotEmpty } from 'class-validator';

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

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  location?: string;

  @IsDateString()
  @IsNotEmpty()
  memoryDate: string;
}