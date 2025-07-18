// src/auth/auth.service.ts
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly firebaseService: FirebaseService,
    private readonly mailService: MailService,
  ) {}

  // --- LUỒNG ĐĂNG KÝ EMAIL/PASS ---
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
      },
    });
    return this.generateAppJwt(user.userID, user.email);
  }

  // --- LUỒNG ĐĂNG NHẬP EMAIL/PASS ---
  async signIn(dto: SignInDto): Promise<{ accessToken: string }> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || user.auth_provider !== 'email' || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials.');
    }
    const isPasswordMatching = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordMatching) throw new UnauthorizedException('Invalid credentials.');

    return this.generateAppJwt(user.userID, user.email);
  }

  // --- LUỒNG XÁC THỰC FIREBASE (SOCIAL) ---
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
      if (!dto.display_name && !name) {
        throw new BadRequestException('Display name is required for new user.');
      }
      user = await this.prisma.user.create({
        data: {
          userID: uid,
          email,
          display_name: dto.display_name || name,
          avatar: picture,
          auth_provider: provider,
        },
      });
    } else {
      if (user.auth_provider !== provider) {
        throw new ConflictException(`This email is already registered with ${user.auth_provider}. Please log in using that method.`);
      }
    }
    return this.generateAppJwt(user.userID, user.email);
  }
  
  // --- LUỒNG QUÊN MẬT KHẨU ---
  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (!user || user.auth_provider !== 'email') {
      return { message: 'If a matching account exists, an email has been sent.' };
    }

    const otp = this.generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Hết hạn sau 10 phút

    await this.prisma.user.update({
      where: { userID: user.userID },
      data: { passwordResetOtp: otp, passwordResetExpires: expiresAt },
    });

    await this.mailService.sendPasswordResetOtp(user.email, otp);
    return { message: 'If a matching account exists, an email has been sent.' };
  }

  // --- LUỒNG ĐẶT LẠI MẬT KHẨU ---
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
  
  // --- HÀM HỖ TRỢ ---
  private async generateAppJwt(userId: string, email: string): Promise<{ accessToken: string }> {
    const payload = { sub: userId, email };
    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '1d',
      }),
    };
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}