import { IsString, IsOptional, IsUUID, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

export class SearchMemoryDto {
  @IsString()
  @IsOptional()
  query?: string;

  @IsOptional()
  @Transform(({ value }) => value.split(','))
  @IsUUID('4', { each: true })
  emotions?: string[];

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}