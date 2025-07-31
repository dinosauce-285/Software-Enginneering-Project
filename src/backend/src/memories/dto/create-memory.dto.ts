// src/memories/dto/create-memory.dto.ts
import { IsArray, IsOptional, IsString, MaxLength, IsNotEmpty, IsUUID, IsDateString } from 'class-validator';

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
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  location?: string;
  
  // THÊM TRƯỜNG NÀY VÀO
  // Tên trường phải là "created_at" để khớp với schema
  @IsDateString()
  @IsOptional() // Đặt là Optional để nếu không gửi, nó sẽ lấy giá trị mặc định now()
  created_at?: string; 
}