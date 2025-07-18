import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MaxLength(50)
  @IsOptional()
  display_name?: string;

  @IsUrl()
  @IsOptional()
  avatar?: string;
}