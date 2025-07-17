import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateMemoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsUUID() // Đảm bảo emotionID là một UUID hợp lệ
  @IsNotEmpty()
  emotionID: string;

  // Các trường khác như tags, media sẽ được xử lý riêng hoặc trong các phiên bản sau
}