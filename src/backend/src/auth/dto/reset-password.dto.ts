import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from 'class-validator';
export class ResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'OTP must be exactly 6 characters.' })
  otp: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'New password must be at least 8 characters long.' })
  newPassword: string;
}