// src/memories/dto/create-memory.dto.ts
import { IsArray, IsOptional, IsString, MaxLength, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateMemoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsUUID()
  @IsNotEmpty()
  emotionID: string;

  @IsArray()
  @IsString({ each: true }) // Mỗi phần tử là một chuỗi
  @IsOptional() // Cho phép không có tag nào
  tags?: string[]; // Ví dụ: ["du lịch", "kỷ niệm đẹp"]
}