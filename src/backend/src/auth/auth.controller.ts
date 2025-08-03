// src/auth/auth.controller.ts

// 1. THÊM CÁC DECORATOR CẦN THIẾT VÀO DÒNG IMPORT
import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Request, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { FirebaseAuthDto } from './dto/firebase-auth.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ChangePasswordDto } from './dto/change-password.dto'; // <-- IMPORT DTO MỚI
import { ChangeEmailDto } from './dto/change-email.dto';
import { ChangeUsernameDto } from './dto/change-username.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete-account') // <-- Dùng phương thức DELETE
  @HttpCode(HttpStatus.OK)
  deleteAccount(@Request() req, @Body() dto: DeleteAccountDto) {
    return this.authService.deleteAccount(req.user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-username')
  async changeUsername(@Request() req, @Body() dto: ChangeUsernameDto) {
    // Trả về user đã được cập nhật để frontend có thể đồng bộ
    return this.authService.changeUsername(req.user.sub, dto);
  }

  @Post('firebase')
  @HttpCode(HttpStatus.OK)
  authenticateWithFirebase(@Body() dto: FirebaseAuthDto) {
    return this.authService.authenticateWithFirebase(dto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }
  @UseGuards(JwtAuthGuard) // <-- BẮT BUỘC: Bảo vệ route này
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
    // req.user được thêm vào bởi JwtAuthGuard, chứa payload của token
    const userId = req.user.sub; // hoặc req.user.userID, tùy vào payload của bạn
    return this.authService.changePassword(userId, dto);
  }
  @UseGuards(JwtAuthGuard)
  @Post('change-email') // <-- KIỂM TRA KỸ DÒNG NÀY
  @HttpCode(HttpStatus.OK)
  changeEmail(@Request() req, @Body() dto: ChangeEmailDto) {
    const userId = req.user.sub;
    return this.authService.changeEmail(userId, dto);
  }
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }


  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  getProfile(@Request() req) {

    return this.authService.getProfile(req.user.sub);
  }
}