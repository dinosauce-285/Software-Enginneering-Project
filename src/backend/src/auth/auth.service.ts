
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
import { randomBytes } from 'crypto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangeEmailDto } from './dto/change-email.dto';
import { ChangeUsernameDto } from './dto/change-username.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';


type AuthResponse = {
  accessToken: string;
  user: Omit<User, 'passwordHash'>;
};
type SafeUser = Omit<User, 'passwordHash'>;
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly firebaseService: FirebaseService,
    private readonly mailService: MailService,
    private activityLogsService: ActivityLogsService, 
  ) { }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({ where: { userID: userId } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (!user.passwordHash) {
      throw new BadRequestException('This account does not have a password set up. You may have signed in using a social provider.');
    }

    const isPasswordMatching = await bcrypt.compare(dto.oldPassword, user.passwordHash);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Incorrect old password.');
    }

    const isSamePassword = await bcrypt.compare(dto.newPassword, user.passwordHash);
    if (isSamePassword) {
      throw new BadRequestException('New password cannot be the same as the old password.');
    }

    const newHashedPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { userID: user.userID },
      data: { passwordHash: newHashedPassword },
    });

     // ✅ Ghi log đổi mật khẩu thành công
    await this.activityLogsService.logActivity(user.userID, 'Change Password', '-');

    try {
      await this.mailService.sendPasswordChangeNotification(user.email, user.display_name);
    } catch (error) {
      console.error(`Failed to send password change notification to ${user.email} after a successful password change.`, error);
    }

    return { message: 'Password changed successfully.' };
  }

  async changeEmail(userId: string, dto: ChangeEmailDto): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({ where: { userID: userId } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (!user.passwordHash) {
      throw new BadRequestException('This action requires a password. Accounts using social login cannot change their email this way.');
    }

    const isPasswordMatching = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Incorrect password. Email change failed.');
    }

    if (dto.newEmail === user.email) {
      throw new BadRequestException('New email cannot be the same as the current email.');
    }
    const existingUserWithNewEmail = await this.prisma.user.findUnique({
      where: { email: dto.newEmail },
    });
    if (existingUserWithNewEmail) {
      throw new ConflictException('This email address is already in use by another account.');
    }

    await this.prisma.user.update({
      where: { userID: user.userID },
      data: { email: dto.newEmail },
    });

    try {
      await this.mailService.sendEmailChangeConfirmation(dto.newEmail, user.display_name);
    } catch (error) {
      console.error(`Failed to send email change confirmation to ${dto.newEmail}`, error);
    }

    return { message: 'Email changed successfully. Please use your new email to log in from now on.' };
  }
  async changeUsername(userId: string, dto: ChangeUsernameDto): Promise<Omit<User, 'passwordHash'>> {
    // 1. Tìm người dùng bằng ID từ token
    const user = await this.prisma.user.findUnique({ where: { userID: userId } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    // 2. Kiểm tra quy tắc 30 ngày một cách an toàn ở backend
    if (user.usernameLastChangedAt) {
      const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
      const timeSinceLastChange = new Date().getTime() - user.usernameLastChangedAt.getTime();

      if (timeSinceLastChange < thirtyDaysInMs) {
        const daysLeft = Math.ceil((thirtyDaysInMs - timeSinceLastChange) / (1000 * 60 * 60 * 24));
        throw new BadRequestException(`You can only change your username once every 30 days. Please wait ${daysLeft} more day(s).`);
      }
    }

    // 3. Kiểm tra username mới không được trùng với username hiện tại
    if (dto.newUsername === user.display_name) {
      throw new BadRequestException('New username cannot be the same as the current one.');
    }

    // 4. Cập nhật username mới và thời điểm thay đổi vào cơ sở dữ liệu
    const updatedUser = await this.prisma.user.update({
      where: { userID: userId },
      data: {
        display_name: dto.newUsername,
        usernameLastChangedAt: new Date(),
      },
    });

    // 5. Loại bỏ passwordHash khỏi đối tượng trả về để đảm bảo an toàn
    const { passwordHash, ...safeResult } = updatedUser;

    // 6. Trả về đối tượng người dùng đã được "làm sạch"
    return safeResult;
  }
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
    const { passwordHash, ...userResult } = user;
    return { accessToken, user: userResult };
  }

  async signIn(dto: SignInDto): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || user.auth_provider !== 'email' || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    if (user.lockUntil && user.lockUntil > new Date()) {
      const remainingMs = user.lockUntil.getTime() - Date.now();
      const remainingSeconds = Math.ceil(remainingMs / 1000);
      const remainingMinutes = Math.ceil(remainingSeconds / 60);
      throw new UnauthorizedException(`Account is temporarily locked. Please try again after ${remainingMinutes} minute(s) (${remainingSeconds} seconds).`);
    }

    const isPasswordMatching = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordMatching) {
      const failedAttempts = (user.failedLoginAttempts ?? 0) + 1;
      if (failedAttempts >= 5) {
        const lockUntil = new Date(Date.now() + 10 * 60 * 1000);
        await this.prisma.user.update({
          where: { userID: user.userID },
          data: { failedLoginAttempts: failedAttempts, lockUntil: lockUntil },
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

    await this.prisma.user.update({
      where: { userID: user.userID },
      data: { failedLoginAttempts: 0, lockUntil: null },
    });

    await this.activityLogsService.logActivity(user.userID, 'Login', '-');

    const expiresIn = dto.rememberMe ? '30d' : '1d';
    const accessToken = await this.generateAppJwt(user.userID, user.email, user.role, expiresIn);
    const { passwordHash, ...userResult } = user;
    return { accessToken, user: userResult };
  }

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

  async verifyOtp(dto: VerifyOtpDto): Promise<{ otpVerificationToken: string }> {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email, passwordResetOtp: dto.otp },
    });
    if (!user) throw new BadRequestException('Invalid or incorrect OTP.');
    if (!user.passwordResetExpires || new Date() > user.passwordResetExpires) {
      throw new BadRequestException('OTP has expired.');
    }
    const verificationToken = randomBytes(32).toString('hex');
    await this.prisma.user.update({
      where: { userID: user.userID },
      data: {
        otpVerificationToken: verificationToken,
        passwordResetOtp: null,
        passwordResetExpires: null,
      },
    });
    return { otpVerificationToken: verificationToken };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { otpVerificationToken: dto.otpVerificationToken },
    });
    if (!user) {
      throw new BadRequestException('Invalid or expired verification token.');
    }
    if (user.passwordHash) {
      const isSamePassword = await bcrypt.compare(dto.newPassword, user.passwordHash);
      if (isSamePassword) {
        throw new BadRequestException('New password cannot be the same as the old password.');
      }
    }
    const newHashedPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { userID: user.userID },
      data: {
        passwordHash: newHashedPassword,
        otpVerificationToken: null,
      },
    });
    return { message: 'Password has been reset successfully.' };
  }

  private async generateAppJwt(userId: string, email: string, role: Role, expiresIn: string): Promise<string> {
    const payload = { sub: userId, email, role, userID: userId };
    return this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: expiresIn,
    });
  }

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

  async deleteAccount(userId: string, dto: DeleteAccountDto): Promise<{ message: string }> {
    // 1. Tìm người dùng bằng ID từ token
    const user = await this.prisma.user.findUnique({ where: { userID: userId } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    // 2. Yêu cầu xác thực bằng mật khẩu
    // Cho phép cả user đăng nhập bằng social media xóa tài khoản mà không cần mật khẩu
    if (user.passwordHash) {
      const isPasswordMatching = await bcrypt.compare(dto.password, user.passwordHash);
      if (!isPasswordMatching) {
        throw new UnauthorizedException('Incorrect password. Account deletion failed.');
      }
    } else if (user.auth_provider !== 'email' && dto.password) {
      // Nếu là tài khoản social mà lại nhập pass -> lỗi
      throw new BadRequestException('Social accounts do not require a password for deletion.');
    }

     // ✅ Ghi log trước khi xóa tài khoản
    await this.activityLogsService.logActivity(user.userID, 'Delete Account', user.email);

    // 3. THỰC HIỆN XÓA TÀI KHOẢN
    // Nhờ có "onDelete: Cascade", Prisma sẽ xóa tất cả dữ liệu liên quan
    await this.prisma.user.delete({
      where: { userID: userId },
    });

    // Gửi email thông báo cuối cùng (tùy chọn nhưng nên có)
    try {
      // Bạn có thể tạo một hàm mới trong MailService
      // await this.mailService.sendGoodbyeEmail(user.email, user.display_name);
    } catch (error) {
      console.error("Failed to send goodbye email, but account was deleted.", error);
    }

    return { message: 'Your account has been permanently deleted.' };
  }

}