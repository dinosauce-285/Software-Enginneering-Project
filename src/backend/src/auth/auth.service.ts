// src/auth/auth.service.ts
import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { FirebaseService } from '../firebase/firebase.service';
import { MailService } from '../mail/mail.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { FirebaseAuthDto } from './dto/firebase-auth.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as bcrypt from 'bcrypt';
import { Gender } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService, private readonly firebaseService: FirebaseService, private readonly mailService: MailService) {}

  async signUp(dto: SignUpDto): Promise<{ accessToken: string }> {
    const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existingUser) throw new ConflictException('Email already in use.');
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        display_name: dto.display_name,
        passwordHash: hashedPassword,
        auth_provider: 'email',
        gender: dto.gender,
        dateOfBirth: new Date(dto.dateOfBirth),
      },
    });
    // Sau khi đăng ký, cấp một token ngắn hạn mặc định
    return this.generateAppJwt(user.userID, user.email, '1d');
  }

  // --- HÀM SIGNIN ĐÃ ĐƯỢỢC CẬP NHẬT ---
  async signIn(dto: SignInDto): Promise<{ accessToken: string }> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || user.auth_provider !== 'email' || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials.');
    }
    const isPasswordMatching = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials.');
    }
    // Quyết định thời hạn của token dựa trên lựa chọn của người dùng
    const expiresIn = dto.rememberMe ? '30d' : '1d';
    return this.generateAppJwt(user.userID, user.email, expiresIn);
  }

  async authenticateWithFirebase(dto: FirebaseAuthDto): Promise<{ accessToken: string }> {
    let decodedToken;
    try {
      decodedToken = await this.firebaseService.verifyIdToken(dto.idToken);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
    const { uid, email, picture, name } = decodedToken;
    const provider = decodedToken.firebase.sign_in_provider;
    let user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          userID: uid,
          email,
          display_name: dto.display_name || name,
          avatar: picture,
          auth_provider: provider,
          gender: Gender.OTHER,
          dateOfBirth: new Date(),
        },
      });
    } else {
      if (user.auth_provider !== provider) {
        throw new ConflictException(`This email is already registered with ${user.auth_provider}. Please log in using that method.`);
      }
    }
    // Social login cũng mặc định cấp token ngắn hạn
    return this.generateAppJwt(user.userID, user.email, '1d');
  }
  
  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || user.auth_provider !== 'email') {
      return { message: 'If a matching account exists, an email has been sent.' };
    }
    const otp = this.generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await this.prisma.user.update({
      where: { userID: user.userID },
      data: { passwordResetOtp: otp, passwordResetExpires: expiresAt },
    });
    await this.mailService.sendPasswordResetOtp(user.email, otp);
    return { message: 'If a matching account exists, an email has been sent.' };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email, passwordResetOtp: dto.otp },
    });
    if (!user) throw new BadRequestException('Invalid or incorrect OTP.');
    if (!user.passwordResetExpires || new Date() > user.passwordResetExpires) {
      await this.prisma.user.update({
        where: { userID: user.userID },
        data: { passwordResetOtp: null, passwordResetExpires: null },
      });
      throw new BadRequestException('OTP has expired. Please request a new one.');
    }
    const newHashedPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { userID: user.userID },
      data: {
        passwordHash: newHashedPassword,
        passwordResetOtp: null,
        passwordResetExpires: null,
      },
    });
    return { message: 'Password has been reset successfully.' };
  }
  
  // --- HÀM GENERATEAPPJWT ĐÃ ĐƯỢỢC NÂNG CẤP ---
  private async generateAppJwt(userId: string, email: string, expiresIn: string): Promise<{ accessToken: string }> {
    const payload = { sub: userId, email };
    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: expiresIn, // Sử dụng thời hạn động
      }),
    };
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}