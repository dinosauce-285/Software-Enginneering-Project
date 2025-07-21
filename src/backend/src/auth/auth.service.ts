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

  /**
   * 1. Đăng ký người dùng mới bằng Email, Password và các thông tin cá nhân.
   */
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
        // -- Dữ liệu mới giờ là bắt buộc --
        gender: dto.gender,
        dateOfBirth: new Date(dto.dateOfBirth), // Không cần kiểm tra null nữa
      },
    });
    return this.generateAppJwt(user.userID, user.email);
  }

  /**
   * 2. Đăng nhập người dùng bằng Email và Password.
   */
  async signIn(dto: SignInDto): Promise<{ accessToken: string }> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    // Từ chối nếu user không tồn tại, không phải đăng ký bằng email, hoặc không có mật khẩu
    if (!user || user.auth_provider !== 'email' || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials.');
    }
    // So sánh mật khẩu người dùng nhập với hash trong DB
    const isPasswordMatching = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials.');
    }
    return this.generateAppJwt(user.userID, user.email);
  }

  /**
   * 3. Xác thực người dùng qua Social Login (Google, Facebook) bằng Firebase ID Token.
   */
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

    if (!user) { // Nếu là người dùng mới
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
          // gender và dateOfBirth sẽ là null vì chúng ta không nhận được từ social login này
        },
      });
    } else { // Nếu người dùng đã tồn tại
      if (user.auth_provider !== provider) {
        throw new ConflictException(`This email is already registered with ${user.auth_provider}. Please log in using that method.`);
      }
    }
    return this.generateAppJwt(user.userID, user.email);
  }
  
  /**
   * 4. Xử lý yêu cầu quên mật khẩu (gửi OTP).
   */
  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    // Luôn trả về thông báo chung chung để bảo mật
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

  /**
   * 5. Xử lý việc đặt lại mật khẩu mới bằng OTP.
   */
  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email, passwordResetOtp: dto.otp },
    });
    if (!user) throw new BadRequestException('Invalid or incorrect OTP.');
    
    if (!user.passwordResetExpires || new Date() > user.passwordResetExpires) {
      // Xóa OTP hết hạn để tránh bị thử lại
      await this.prisma.user.update({
        where: { userID: user.userID },
        data: { passwordResetOtp: null, passwordResetExpires: null },
      });
      throw new BadRequestException('OTP has expired. Please request a new one.');
    }

    const newHashedPassword = await bcrypt.hash(dto.newPassword, 10);
    // Cập nhật mật khẩu mới và xóa thông tin OTP
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
  
  // --- CÁC HÀM HỖ TRỢ (PRIVATE) ---

  /**
   * Tạo JWT Token của ứng dụng.
   */
  private async generateAppJwt(userId: string, email: string): Promise<{ accessToken: string }> {
    const payload = { sub: userId, email };
    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '1d', // Token có hiệu lực trong 1 ngày
      }),
    };
  }

  /**
   * Tạo mã OTP 6 số ngẫu nhiên.
   */
  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}