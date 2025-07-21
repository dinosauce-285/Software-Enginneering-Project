// src/auth/dto/signup.dto.ts
import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Gender } from '@prisma/client';

export class SignUpDto {
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  password: string;

  @IsString()
  @IsNotEmpty()
  display_name: string;

  // --- CÁC TRƯỜNG ĐÃ SỬA ĐỔI ---
  @IsNotEmpty({ message: 'Gender must be selected.'})
  @IsEnum(Gender, { message: 'Gender must be one of the following: MALE, FEMALE, OTHER' })
  gender: Gender; // Đã xóa '?'

  @IsNotEmpty({ message: 'Date of birth is required.'})
  @IsDateString({}, { message: 'Date of birth must be a valid ISO 8601 date string.' })
  dateOfBirth: string; // Đã xóa '?'
}