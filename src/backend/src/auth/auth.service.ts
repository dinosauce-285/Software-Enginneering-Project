import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
  NotFoundException, 
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
import { Gender, Role, User } from '@prisma/client';

type AuthResponse = {
  accessToken: string;
  user: Omit<User, 'passwordHash'>;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly firebaseService: FirebaseService,
    private readonly mailService: MailService,
  ) { }

  /**
   * Đăng ký người dùng mới bằng Email, trả về AuthResponse.
   */
  async signUp(dto: SignUpDto): Promise<AuthResponse> {
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

    const accessToken = await this.generateAppJwt(user.userID, user.email, user.role, '1d');

    // Loại bỏ passwordHash khỏi object user trước khi trả về
    const { passwordHash, ...userResult } = user;

    return { accessToken, user: userResult };
  }

  /**
   * Đăng nhập người dùng bằng Email, trả về AuthResponse.
   */
  async signIn(dto: SignInDto): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (!user || user.auth_provider !== 'email' || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    // Check if account is currently locked
    if (user.lockUntil && user.lockUntil > new Date()) {
      const remainingMs = user.lockUntil.getTime() - Date.now();
      const remainingSeconds = Math.ceil(remainingMs / 1000);
      const remainingMinutes = Math.ceil(remainingSeconds / 60);

      throw new UnauthorizedException(
        `Account is temporarily locked. Please try again after ${remainingMinutes} minute(s) (${remainingSeconds} seconds).`
      );
    }

    // Check password
    const isPasswordMatching = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isPasswordMatching) {
      const failedAttempts = (user.failedLoginAttempts ?? 0) + 1;

      if (failedAttempts >= 5) {
        const lockUntil = new Date(Date.now() + 10 * 60 * 1000); // lock for 10 minutes
        await this.prisma.user.update({
          where: { userID: user.userID },
          data: {
            failedLoginAttempts: failedAttempts,
            lockUntil: lockUntil,
          },
        });
        throw new UnauthorizedException('Too many failed login attempts. Account is locked for 10 minutes.');
      } else {
        await this.prisma.user.update({
          where: { userID: user.userID },
          data: { failedLoginAttempts: failedAttempts },
        });
        throw new UnauthorizedException('Invalid credentials.');
      }
    }

    // Successful login: reset failedLoginAttempts & lockUntil
    await this.prisma.user.update({
      where: { userID: user.userID },
      data: { failedLoginAttempts: 0, lockUntil: null },
    });

    const expiresIn = dto.rememberMe ? '30d' : '1d';
    const accessToken = await this.generateAppJwt(user.userID, user.email, user.role, expiresIn);

    // Exclude passwordHash before returning
    const { passwordHash, ...userResult } = user;

    return { accessToken, user: userResult };
  }

  /**
   * Xác thực qua Firebase (Google/Facebook), trả về AuthResponse.
   */
  async authenticateWithFirebase(dto: FirebaseAuthDto): Promise<AuthResponse> {
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
    const accessToken = await this.generateAppJwt(user.userID, user.email, user.role, '1d');

    const { passwordHash, ...userResult } = user;

    return { accessToken, user: userResult };
  }

  /**
   * Gửi OTP quên mật khẩu.
   */
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

  /**
   * Đặt lại mật khẩu mới bằng OTP.
   */
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

  /**
   * Tạo JWT Token của ứng dụng, bao gồm cả vai trò (role).
   */

private async generateAppJwt(userId: string, email: string, role: Role, expiresIn: string): Promise<string> {
  const payload = { sub: userId, email, role, userID: userId };
  return this.jwtService.signAsync(payload, {
    secret: process.env.JWT_SECRET,
    expiresIn: expiresIn,
  });
}

  /**
   * Tạo mã OTP 6 số.
   */
  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }


  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        userID: userId,
      },
      select: {
        userID: true,
        email: true,
        display_name: true,
        avatar: true, 
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}