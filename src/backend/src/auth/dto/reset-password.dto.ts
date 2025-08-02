import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from 'class-validator';
export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  otpVerificationToken: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'New password must be at least 8 characters long.' })
  newPassword: string;
}